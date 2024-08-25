import { HitState } from "./HitState";
import { IHitProject } from "./IHitProject";

/**
 * Represents an assignment of a HIT (Human Intelligence Task) to a worker on
 * Amazon Mechanical Turk.
 */
export interface IHitAssignment {
  /**
   * Unique identifier for the task within the HIT.
   */
  task_id: string;

  /**
   * Unique identifier for the assignment given to the worker.
   */
  assignment_id: string;

  /**
   * The timestamp when the HIT was accepted by the worker.
   */
  accepted_at: string;

  /**
   * The deadline timestamp by which the HIT must be completed.
   */
  deadline: string;

  /**
   * The remaining time in seconds until the HIT's deadline.
   */
  time_to_deadline_in_seconds: number;

  /**
   * Unique identifier for the HIT.
   */
  hit_id: string;

  /**
   * The current state of the HIT assignment (e.g., Submitted, Approved,
   * Rejected).
   */
  state: HitState;

  /**
   * Information about the project (HIT) associated with the assignment.
   */
  project: IHitProject;
}
