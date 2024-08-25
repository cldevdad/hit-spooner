import { IHitReward } from "./IHitReward";
import { IQualification } from "./IQualification";

/**
 * Interface representing a HIT (Human Intelligence Task) project from the Mturk
 * API.
 */
export interface IHitProject {
  /**
   * The unique identifier for the HIT set.
   */
  hit_set_id: string;

  /**
   * The unique identifier for the requester who created the HIT.
   */
  requester_id: string;

  /**
   * The name of the requester who created the HIT.
   */
  requester_name: string;

  /**
   * The title of the HIT.
   */
  title: string;

  /**
   * The description of the HIT.
   */
  description?: string;

  /**
   * The monetary reward for completing the HIT.
   */
  monetary_reward: IHitReward;

  /**
   * The time allotted to complete the HIT, in seconds.
   */
  time_allotted?: number;

  /**
   * The creation time of the HIT, in ISO 8601 format.
   */
  creation_time?: string;

  /**
   * The expiration time of the HIT, in ISO 8601 format.
   */
  expiration_time?: string;

  /**
   * URL to accept the project task.
   */
  accept_project_task_url: string;

  /**
   * URL to the requester's projects.
   */
  requester_url?: string;

  /**
   * URL to the project tasks.
   */
  project_tasks_url?: string;

  /**
   * The number of assignments available for the HIT.
   */
  assignments_available?: number;

  /**
   * The number of HITs that can currently be assigned to workers.
   */
  assignable_hits_count?: number;

  /**
   * The duration of the assignment in seconds.
   */
  assignment_duration_in_seconds?: number;

  /**
   * The qualifications required to complete the HIT.
   */
  qualifications?: IQualification[];

  /**
   * The auto-approval delay in seconds.
   */
  auto_approval_delay_in_seconds?: number;

  /**
   * Indicates whether the HIT is currently reviewable.
   */
  has_reviewable?: boolean;

  /**
   * The last time the HIT was updated, in ISO 8601 format.
   */
  last_updated_time?: string;

  /**
   * The last time the HIT was seen, in ISO 8601 format.
   */
  last_seen?: string;

  /**
   * Indicates whether the HIT is currently unavailable.
   */
  unavailable?: boolean;

  /**
   * Indicates whether the HIT is marked for automatic acceptance when it
   * becomes available.
   */
  scoop?: "scoop" | "shovel";

  /**
   * The estimated hourly rate for the HIT, as a string representation (e.g.,
   * "$15.00/hr").
   */
  hourly_rate?: string;

  /**
   * Indicates whether the caller meets all the requirements for the HIT.
   */
  caller_meets_requirements?: boolean;

  /**
   * Indicates whether the caller meets the preview requirements for the HIT.
   */
  caller_meets_preview_requirements?: boolean;
}
