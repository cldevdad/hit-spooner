/**
 * Interface representing the monetary reward for completing a HIT.
 */
export interface IHitReward {
  /**
   * The currency code (e.g., "USD").
   */
  currency_code: string;

  /**
   * The amount of the reward in dollars.
   */
  amount_in_dollars: number;
}
