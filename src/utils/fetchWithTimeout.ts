/**
 * Fetches a URL with a timeout using AbortController.
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds
 * @returns Promise<Response>
 */
export const fetchWithTimeout = (
  url: string,
  options: RequestInit = {},
  timeout: number
): { promise: Promise<Response>; abort: () => void } => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const promise = fetch(url, {
    ...options,
    signal: controller.signal,
  }).then(response => {
    clearTimeout(timeoutId);
    return response;
  }).catch(error => {
    clearTimeout(timeoutId);
    throw error;
  });

  const abort = () => {
    controller.abort();
    clearTimeout(timeoutId);
  };

  return { promise, abort };
};
