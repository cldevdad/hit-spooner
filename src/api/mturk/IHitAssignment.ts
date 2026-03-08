import { HitState } from "./HitState";
import { IHitProject } from "./IHitProject";

export interface IHitAssignment {
  task_id: string;
  assignment_id: string;
  accepted_at: string;
  deadline: string;
  time_to_deadline_in_seconds: number;
  hit_id: string;
  state: HitState;
  project: IHitProject;
  task_url?: string;
}
