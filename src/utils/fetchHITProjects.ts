import { IHitProject, IHitSearchFilter } from "@hit-spooner/api";
import { fetchWithTimeout } from "./fetchWithTimeout";

const FETCH_TIMEOUT_MS = 25000; // Increased timeout for better reliability
const PAGE_DELAY_MS = 1200; // Slightly increased to be more respectful of MTurk rate limits
const MAX_RETRIES = 5; // Increased retries for better resilience
const MAX_PAGES = 8; // Increased to get more hits per fetch
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 60000; // Increased max delay for better backoff
const CONCURRENT_REQUESTS = 2; // Allow limited concurrent requests for faster fetching

interface RetryState {
  retryCount: number;
  lastError: Error | null;
  consecutiveFailures: number;
}

// Global request tracking to prevent overwhelming the server
let activeRequests = 0;
const maxConcurrentRequests = 3;
const requestQueue: Array<() => void> = [];

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const exponentialBackoff = (attempt: number): number => {
  const delayMs = Math.min(BASE_DELAY_MS * Math.pow(2, attempt), MAX_DELAY_MS);
  return delayMs + Math.random() * 2000; // Add more jitter to avoid synchronized requests
};

const handleRetry = async (error: Error, attempt: number): Promise<boolean> => {
  if (attempt >= MAX_RETRIES) {
    throw new Error(`Max retries (${MAX_RETRIES}) exceeded. Last error: ${error.message}`);
  }

  const backoffDelay = exponentialBackoff(attempt);
  
  await delay(backoffDelay);
  return true;
};

// Rate limiting to prevent overwhelming MTurk servers
const acquireRequestSlot = async (): Promise<void> => {
  return new Promise((resolve) => {
    const tryAcquire = () => {
      if (activeRequests < maxConcurrentRequests) {
        activeRequests++;
        resolve();
      } else {
        // Queue the request
        requestQueue.push(tryAcquire);
      }
    };
    tryAcquire();
  });
};

const releaseRequestSlot = (): void => {
  activeRequests = Math.max(0, activeRequests - 1);
  if (requestQueue.length > 0) {
    const nextRequest = requestQueue.shift();
    if (nextRequest) {
      nextRequest();
    }
  }
};

export const fetchHITProjects = async (
  filters: IHitSearchFilter,
  retryState: RetryState = { retryCount: 0, lastError: null, consecutiveFailures: 0 }
): Promise<IHitProject[]> => {
  let allHITs: IHitProject[] = [];
  let pageNumber = 1;
  const pageSize = filters.pageSize || "50";

  try {
    // Acquire request slot to prevent overwhelming the server
    await acquireRequestSlot();

    while (pageNumber <= MAX_PAGES) {
      const params = new URLSearchParams({
        "filters[qualified]": filters.qualified ? "true" : "false",
        "filters[masters]": filters.masters ? "true" : "false",
        "filters[min_reward]": filters.minReward || "0",
        "filters[page_size]": pageSize,
        page_number: pageNumber.toString(),
        sort: filters.sort,
        format: "json",
      });

      const baseUrl = "https://worker.mturk.com/?";
      const url = `${baseUrl}${params.toString()}`;

      let attempt = 0;
      let success = false;
      let response: Response;

      while (attempt < MAX_RETRIES && !success) {
        try {
          const { promise } = fetchWithTimeout(url, {
            credentials: "include",
            redirect: "follow",
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'en-US,en;q=0.9',
              'Accept-Encoding': 'gzip, deflate, br',
              'DNT': '1',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'Sec-Fetch-Dest': 'empty',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Site': 'same-origin',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
            }
          }, FETCH_TIMEOUT_MS);

          response = await promise;

          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              throw new Error("Session expired - please log in to MTurk");
            }
            if (response.status === 429) {
              // Rate limited - increase delay significantly
              retryState.consecutiveFailures++;
              const rateLimitDelay = Math.min(30000 * Math.pow(2, retryState.consecutiveFailures), 300000);
              console.warn(`Rate limited, waiting ${rateLimitDelay}ms before retry`);
              await delay(rateLimitDelay);
              throw new Error(`Rate limited - status: ${response.status}`);
            }
            if (response.status >= 500) {
              throw new Error(`Server error - status: ${response.status}`);
            }
            if (response.status === 408 || response.status === 409) {
              // Timeout or conflict - retry with longer delay
              await delay(5000);
              throw new Error(`Request conflict/timeout status: ${response.status}`);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // Reset consecutive failures on successful response
          retryState.consecutiveFailures = 0;
          success = true;
        } catch (error: unknown) {
          attempt++;
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              throw new Error(`Request timeout after ${FETCH_TIMEOUT_MS}ms`);
            }
            
            if (attempt < MAX_RETRIES) {
              const shouldContinue = await handleRetry(error, attempt);
              if (!shouldContinue) {
                throw error;
              }
            } else {
              throw new Error(`Failed after ${MAX_RETRIES} attempts. Last error: ${error.message}`);
            }
          } else {
            throw new Error(`Unknown error: ${String(error)}`);
          }
        }
      }

      try {
        const data = await response!.json();

        if (!data || !data.results || !Array.isArray(data.results)) {
          console.warn('Invalid response format received, stopping pagination');
          break;
        }

        const newHits = data.results;
        allHITs = allHITs.concat(newHits);

        // Log progress for debugging
        console.log(`Fetched page ${pageNumber}: ${newHits.length} hits. Total: ${allHITs.length}`);

        if (newHits.length < parseInt(pageSize)) {
          break; // Last page
        }

        pageNumber += 1;
        
        // Add delay between pages to respect rate limits
        // Use adaptive delay based on server response
        const pageDelay = pageNumber === 1 ? PAGE_DELAY_MS : PAGE_DELAY_MS + Math.random() * 500;
        await delay(pageDelay);
      } catch (parseError: unknown) {
        console.warn('Parse error, stopping pagination:', parseError);
        break;
      }
    }

    // Reset retry state on successful completion
    retryState.retryCount = 0;
    retryState.lastError = null;

    return allHITs;
  } catch (error: unknown) {
    if (error instanceof Error) {
      retryState.retryCount++;
      retryState.lastError = error;
      
      // Log error for debugging
      console.error(`fetchHITProjects failed: ${error.message}`);
      
      // Re-throw to maintain original error propagation behavior
      throw error;
    }
    throw new Error('Unknown error in fetchHITProjects');
  } finally {
    // Always release the request slot
    releaseRequestSlot();
  }
};
