import { IHitProject } from "@hit-spooner/api";

/**
 * Filters an array of HIT projects based on a search string and a list of
 * blocked requesters.
 *
 * @param {IHitProject[]} hits - The array of HIT projects to filter.
 * @param {string} filterText - The text used to filter the HITs. Can include
 * operators like <, <=, >, >=, or = for numeric comparisons.
 * @param {string[]} blockedRequesters - The list of requester IDs that should
 * be excluded from the results.
 * @returns {IHitProject[]} The filtered array of HIT projects.
 */
export const filterHitProjects = (
  hits: IHitProject[],
  filterText: string,
  blockedRequesters: string[]
): IHitProject[] => {
  const numericFilter = parseFilter(filterText);
  const lowerFilterText = filterText.toLowerCase();

  /**
   * Checks if a HIT project matches the provided text or reward amount.
   *
   * @param {IHitProject} hit - The HIT project to check.
   * @returns {boolean} True if the HIT project matches the filter criteria;
   * otherwise, false.
   */
  const matchesTextOrAmount = (hit: IHitProject): boolean => {
    return (
      hit.requester_name.toLowerCase().includes(lowerFilterText) ||
      hit.title.toLowerCase().includes(lowerFilterText) ||
      (hit.description?.toLowerCase().includes(lowerFilterText) ?? false) ||
      hit.monetary_reward.amount_in_dollars.toString().includes(lowerFilterText)
    );
  };

  return hits.filter((hit) => {
    // Exclude blocked requesters
    if (blockedRequesters.includes(hit.requester_id)) {
      return false;
    }

    // Handle numeric filters like <, <=, >, >=, and =.
    if (numericFilter) {
      const amount = hit.monetary_reward.amount_in_dollars;
      switch (numericFilter.operator) {
        case "<":
          return amount < numericFilter.value;
        case "<=":
          return amount <= numericFilter.value;
        case ">":
          return amount > numericFilter.value;
        case ">=":
          return amount >= numericFilter.value;
        case "=":
        default:
          // If the numeric condition is "=" or not provided, check both the
          // reward amount and text fields.
          return amount === numericFilter.value || matchesTextOrAmount(hit);
      }
    }

    // If no numeric filter, perform a regular text search.
    return matchesTextOrAmount(hit);
  });
};

/**
 * Parses the filter text to determine if it contains a numeric filter.
 *
 * @param {string} filterText - The text to parse for numeric filtering.
 * @returns {{ operator: string; value: number } | null} The parsed operator and
 * value, or null if no numeric filter is found.
 */
const parseFilter = (
  filterText: string
): { operator: string; value: number } | null => {
  const numericSearch = filterText.match(/([<>]=?|=)?\s*(\d+(\.\d+)?)/);
  if (numericSearch) {
    const operator = numericSearch[1] || "=";
    const value = parseFloat(numericSearch[2]);
    return { operator, value };
  }
  return null;
};
