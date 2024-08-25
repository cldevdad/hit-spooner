import { HitState } from "./HitState";
import { IHitReward } from "./IHitReward";

/**
 * Interface representing a HIT completion data.
 */
export interface IHitCompletion {
  /**
   * The unique identifier for the assignment.
   */
  assignment_id: string;

  /**
   * The unique identifier for the HIT.
   */
  hit_id: string;

  /**
   * The state of the HIT (e.g., Paid, Approved, Rejected).
   */
  state: HitState;

  /**
   * The title of the HIT.
   */
  title: string;

  /**
   * The unique identifier for the requester.
   */
  requester_id: string;

  /**
   * The name of the requester.
   */
  requester_name: string;

  /**
   * Feedback provided by the requester (if any).
   */
  requester_feedback: string | null;

  /**
   * The reward for completing the HIT, in dollars.
   */
  reward: IHitReward;
}
