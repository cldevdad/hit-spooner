import { IHitProject } from "./mturk";

export interface IHitProjectWithHourlyRate extends IHitProject {
  hourlyRate?: string;
}
