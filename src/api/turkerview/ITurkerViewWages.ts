import { ITurkerViewWageDetails } from "./ITurkerViewWageDetails";

/**
 * Represents TurkerView wage-related information.
 */
export interface ITurkerViewWages {
  /**
   * Average wage information.
   */
  average: ITurkerViewWageDetails;

  /**
   * Average wage information specific to the current user.
   */
  user_average: ITurkerViewWageDetails;
}
