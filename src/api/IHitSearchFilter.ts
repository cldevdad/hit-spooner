/**
 * Type representing the possible values for sorting HITs (Human Intelligence
 * Tasks).
 */
type HitSortOption =
  | "updated_desc"
  | "updated_asc"
  | "reward_desc"
  | "reward_asc"
  | "num_hits_desc"
  | "num_hits_asc";

/**
 * Interface representing the search filters for HITs (Human Intelligence
 * Tasks).
 */
export interface IHitSearchFilter {
  /**
   * Indicates whether to include only qualified HITs.
   */
  qualified: boolean;

  /**
   * Indicates whether to include only HITs requiring Masters qualification.
   */
  masters: boolean;

  /**
   * Minimum reward amount for the HITs in dollars.
   */
  minReward: string;

  /**
   * Sorting preference for the HITs list. Uses the `HitSortOption` type to
   * constrain possible values.
   */
  sort: HitSortOption;

  /**
   * Number of HITs to display per page. Possible values could be "10", "20",
   * "50", or "100".
   */
  pageSize: string;

  currentPage: number;
}
