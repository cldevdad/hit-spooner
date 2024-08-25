import { IHitProject } from "./IHitProject";

/**
 * Represents a HIT task object with its associated properties.
 * TODO: Is this needed? I think IHitAssignment has all these properties.
 */
export interface IHitTask {
  /**
   * The unique identifier for the HIT task.
   * @type {string}
   */
  task_id: string;

  /**
   * The unique identifier for the HIT assignment.
   */
  assignment_id: string;

  /**
   * The remaining time to complete the HIT task in seconds.
   * @type {number}
   */
  time_to_deadline_in_seconds: number;

  /**
   * The project details associated with the HIT task.
   * @type {IHitProject}
   */
  project: IHitProject;
}
