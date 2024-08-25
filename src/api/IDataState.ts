/**
 * Represents the state of a data-fetching operation, including loading, error,
 * data properties, and pagination information.
 *
 * @template T - The type of the data.
 */
export interface IDataState<T> {
  /**
   * The fetched data or null if not loaded yet
   */
  data: T | null;

  /**
   * Indicates whether the data is currently being loaded
   */
  loading: boolean;

  /**
   * Error message or null if no error occurred
   */
  error: string | null;

  /**
   * Total number of items available
   */
  total?: number;

  /**
   * The current page being viewed
   * */
  currentPage?: number;

  /**
   * The number of items per page
   */
  pageSize?: number;
}
