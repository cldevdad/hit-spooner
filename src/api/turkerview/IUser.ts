/**
 * Represents information about the TurkerView user.
 */
export interface ITurkerViewUser {
    /**
     * The number of requests remaining for the user.
     */
    requestsRemaining: number;
  
    /**
     * The user's ID, which may be null.
     */
    userId: string | null;
  }