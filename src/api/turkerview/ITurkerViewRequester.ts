import { ITurkerViewRatings } from "./ITurkerViewRatings";
import { ITurkerViewWages } from "./ITurkerViewWages";

/**
 * Represents TurkerView information about a requester.
 */
export interface ITurkerViewRequester {
  /**
   * The name of the requester.
   */
  requester_name: string;

  /**
   * The ID of the requester.
   */
  requester_id: string;

  /**
   * The number of reviews the requester has received.
   */
  reviews: number;

  /**
   * The number of reviews the current user has given to the requester.
   */
  user_reviews: number;

  /**
   * Information about wages related to the requester.
   */
  wages: ITurkerViewWages;

  /**
   * Ratings for the requester in various categories.
   */
  ratings: ITurkerViewRatings;

  /**
   * The number of rejections the requester has issued.
   */
  rejections: number;

  /**
   * The number of blocks the requester has issued.
   */
  blocks: number;

  /**
   * A potential third-party ID associated with the requester, which may be null.
   */
  thid: string | null;
}
