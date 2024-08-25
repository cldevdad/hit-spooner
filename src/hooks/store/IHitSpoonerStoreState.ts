import {
  IDashboardData,
  IDataState,
  IHitAssignment,
  IHitProject,
  IHitSearchFilter,
} from "@hit-spooner/api";
import { IConfigState } from "./IConfigState";

/**
 * Store state that contains all the application state and actions.
 */
export interface IHitSpoonerStoreState {
  /**
   * State of the HITs data fetching.
   */
  hits: IDataState<IHitProject[]>;

  /**
   * State of the dashboard data fetching.
   */
  dashboard: IDataState<IDashboardData>;

  /**
   * List of blocked requester IDs.
   */
  blockedRequesters: string[];

  /**
   * List of favorite requester IDs.
   */
  favoriteRequesters: { id: string; name: string }[];

  /**
   * Current filters applied to the HITs.
   */
  filters: IHitSearchFilter;

  /**
   * Function to update the filters.
   *
   * @param newFilters - The new set of filters to apply.
   */
  setFilters: (newFilters: IHitSearchFilter) => void;

  /**
   * Function to block a requester by ID.
   *
   * @param requesterId - The ID of the requester to block.
   */
  blockRequester: (requesterId: string) => void;

  /**
   * Function to fetch and update the HITs data.
   */
  fetchAndUpdateHits: () => void;

  /**
   * Function to fetch and update the dashboard data.
   */
  fetchAndUpdateDashboard: () => void;

  /**
   * Function to start the intervals for fetching HITs and dashboard data.
   */
  startUpdateIntervals: () => void;

  /**
   * List of HITs to be accepted automatically.
   */
  hitsToAccept: IHitProject[];

  /**
   * Adds or updates a HIT in the HIT database.
   *
   * @param hit - The HIT to add or update.
   */
  addOrUpdateHit: (hit: IHitProject) => void;

  /**
   * Function to add a HIT to the list of HITs to accept.
   *
   * @param hit - The HIT to add to the list.
   */
  addHitToAccept: (hit: IHitProject) => void;

  /**
   * Function to remove a HIT from the list after it is accepted.
   *
   * @param hit_set_id - The ID of the HIT to remove.
   */
  removeHitFromAccept: (hit_set_id: string) => void;

  /**
   * Function to handle the automatic acceptance process.
   */
  handleAutomaticAcceptance: () => void;

  /**
   * Function to immediately accept a HIT.
   *
   * @param hit - The HIT to accept.
   * @returns A promise that resolves when the HIT is accepted.
   */
  acceptHit: (hit: IHitProject) => Promise<void>;

  /**
   * Configuration state for the application.
   */
  config: IConfigState;

  /**
   * Whether or not store fetching intervals are paused.
   */
  paused?: boolean;

  /**
   * Function to toggle the paused state.
   */
  togglePause: () => void;

  /**
   * Queue of HIT assignments.
   */
  queue: IHitAssignment[];

  /**
   * Indicates whether the queue is currently being loaded.
   */
  loadingQueue: boolean;

  /**
   * Function to fetch and update the HITs queue data.
   */
  fetchAndUpdateHitsQueue: () => void;

  /**
   * Function to toggle a requester as a favorite or remove them from the favorite list.
   *
   * @param requesterId - The ID of the requester to toggle.
   * @param requesterName - The name of the requester to toggle.
   */
  toggleFavoriteRequester: (requesterId: string, requesterName: string) => void;

  /**
   * Function to delete a HIT from the store and IndexedDB.
   *
   * @param hitId - The ID of the HIT to delete.
   */
  deleteHit: (hitId: string) => void;

  /**
   * Function to set the current page of HITs in the pagination.
   *
   * @param page - The page number to set.
   */
  setHitsPage: (page: number) => void;
}
