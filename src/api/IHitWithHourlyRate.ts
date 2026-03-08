import { IHitProject } from "./mturk";
import { ITurkerViewRatings } from "./turkerview";

export interface IHitProjectWithHourlyRate extends IHitProject {
  hourlyRate?: string;
  requesterRatings?: ITurkerViewRatings;
}
