/**
 * Represents detailed TurkerView wage information.
 */
export interface ITurkerViewWageDetails {
  /**
   * The average wage value, which may be null.
   */
  wage: string | null;

  /**
   * A class indicating the wage level (e.g., danger, muted).
   */
  class: string;

  /**
   * The FontAwesome icon class associated with the wage level.
   */
  faicon: string;
}
