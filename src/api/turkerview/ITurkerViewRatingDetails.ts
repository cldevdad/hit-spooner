/**
 * Represents detailed TurkerView rating information.
 */
export interface ITurkerViewRatingDetails {
  /**
   * The textual description of the rating.
   */
  text: string;

  /**
   * A class indicating the rating level (e.g., danger, muted).
   */
  class: string;

  /**
   * The FontAwesome icon class associated with the rating.
   */
  faicon: string;
}
