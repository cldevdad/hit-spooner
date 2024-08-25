import { IHitProject, IHitSearchFilter } from "@hit-spooner/api";

/**
 * Fetches a list of HITs (Human Intelligence Tasks) from the MTurk API based on
 * the provided filters. Continues fetching subsequent pages until fewer than
 * `pageSize` HITs are returned or no HITs are found.
 *
 * @param {IHitSearchFilter} filters - The filters to apply to the HIT search.
 * @returns {Promise<IHitProject[]>} A promise that resolves to an array of HITs.
 */
export const fetchHITProjects = async (
  filters: IHitSearchFilter
): Promise<IHitProject[]> => {
  let allHITs: IHitProject[] = [];
  let pageNumber = 1;
  const pageSize = filters.pageSize || "50";

  // Function to pause execution for a given amount of time
  const debounce = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  try {
    while (true) {
      // Construct the query parameters based on filters and current page.
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

      // Perform the API request to fetch the HITs.
      const response = await fetch(url);

      // Check if the response is not ok and throw an error if so.
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse the JSON response.
      const data = await response.json();

      // Add the fetched HITs to the cumulative array.
      allHITs = allHITs.concat(data.results);

      // Check if fewer than pageSize HITs were returned, indicating the last page.
      if (data.results.length < parseInt(pageSize)) {
        break;
      }

      // Increment the page number for the next request.
      pageNumber += 1;

      // Debounce between requests.
      await debounce(20);
    }
  } catch (error) {
    // Log any errors that occur during the fetch process.
    console.error("Error fetching HITs:", error);
    return [];
  }

  return allHITs;
};
