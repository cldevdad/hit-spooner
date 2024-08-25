import { ITurkerViewRequester } from "./ITurkerViewRequester";
import { ITurkerViewUser } from "./IUser";

/**
 * Represents the response structure for TurkerView requesters.
 */
export interface ITurkerViewRequestersResponse {
  /**
   * Information about the user.
   */
  user: ITurkerViewUser;

  /**
   * A dictionary of requesters, where the key is the requester ID.
   */
  requesters: Record<string, ITurkerViewRequester>;
}
