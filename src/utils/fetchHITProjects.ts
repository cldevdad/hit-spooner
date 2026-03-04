import { IHitProject, IHitSearchFilter } from "@hit-spooner/api";
import { fetchWithTimeout } from "./fetchWithTimeout";

const FETCH_TIMEOUT_MS = 15000;
const PAGE_DELAY_MS = 30;

export const fetchHITProjects = async (
  filters: IHitSearchFilter
): Promise<IHitProject[]> => {
  let allHITs: IHitProject[] = [];
  let pageNumber = 1;
  const pageSize = filters.pageSize || "50";
  const maxPages = 10;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  try {
    while (pageNumber <= maxPages) {
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

      const { promise } = fetchWithTimeout(url, {
        credentials: "include",
        redirect: "error"
      }, FETCH_TIMEOUT_MS);

      const response = await promise;

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Redirected"); // Treat as session expired
        }
        if (response.status === 429) {
          // Implement exponential backoff instead of fixed delay
          const backoff = Math.min(2000 * 2 ** (allHITs.length), 30000);
          await delay(backoff);
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      try {
        const data = await response.json();

        if (!data || !data.results || !Array.isArray(data.results)) {
          break;
        }

        allHITs = allHITs.concat(data.results);

        if (data.results.length < parseInt(pageSize)) {
          break;
        }

        pageNumber += 1;
        await delay(PAGE_DELAY_MS);
      } catch (parseError: unknown) {
        // Silently handle parse errors to avoid console output
        break;
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      // Silently handle timeout errors to avoid console output
    } else {
      // Re-throw the error to maintain original error propagation behavior
      throw error;
    }
  }

  return allHITs;
};
