/**
Interface representing an overview of HITs (Human Intelligence Tasks) for a
user.
 */
export interface IHitsOverview {
  /**
   * The total number of HITs that have been approved.
   * @type {number}
   */
  approved: number;

  /**
   * The approval rate, represented as a percentage (e.g., 95.5).
   * @type {number}
   */
  approval_rate: number;

  /**
   * The total number of HITs that are currently pending approval.
   * @type {number}
   */
  pending: number;

  /**
   * The total number of HITs that have been rejected.
   * @type {number}
   */
  rejected: number;

  /**
   * The rejection rate, represented as a percentage (e.g., 4.5).
   * @type {number}
   */
  rejection_rate: number;
}
