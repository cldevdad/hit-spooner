import { ITurkerViewRatingDetails } from "./ITurkerViewRatingDetails";

/**
 * Represents TurkerView ratings for a requester.
 */
export interface ITurkerViewRatings {
  /**
   * The pay rating of the requester.
   */
  pay: ITurkerViewRatingDetails;

  /**
   * The communication rating of the requester.
   */
  comm: ITurkerViewRatingDetails;

  /**
   * The speed rating of the requester.
   */
  fast: ITurkerViewRatingDetails;
}
