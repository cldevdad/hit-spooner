export interface IConfigState {
  /**
   * The interval for task updates in milliseconds.
   */
  updateInterval: number;

  /**
   * Function to set the update interval.
   *
   * @param interval - The new update interval in milliseconds.
   */
  setUpdateInterval: (interval: number) => void;

  /**
   * The current theme being used
   */
  theme: string;

  /**
   * A record of available themes mapped by their names
   */
  themes: Record<string, any>;

  /**
   * Function to update the current theme
   */
  setTheme: (newTheme: string) => void;

  /**
   * Sizes of the workspace allotment panels
   */
  workspacePanelSizes: number[];

  /**
   * Function to set the sizes of the workspace panels
   */
  setWorkspacePanelSizes: (sizes: number[]) => void;

  /**
   * Sizes of the HitTaskView allotment panels
   */
  hitTaskViewPanelSizes: number[];

  /**
   * Function to set the sizes of the HitTaskView panels
   */
  setHitTaskViewPanelSizes: (sizes: number[]) => void;

  /**
   * Sizes of the internal panels within the workspace
   */
  workspaceListSizes: number[];

  /**
   * Function to set the sizes of the internal panels within the workspace
   */
  setWorkspaceListSizes: (sizes: number[]) => void;

  /**
   * Number of columns for the available HitList in the workspace
   */
  workspaceAvailableColumns: number;

  /**
   * Function to set the number of columns for the available HitList in the workspace
   */
  setWorkspaceAvailableColumns: (columns: number) => void;

  /**
   * Number of columns for the unavailable HitList in the workspace
   */
  workspaceUnavailableColumns: number;

  /**
   * Function to set the number of columns for the unavailable HitList in the workspace
   */
  setWorkspaceUnavailableColumns: (columns: number) => void;

  /**
   * Number of columns for the HitList in the requester modal
   */
  requesterModalColumns: number;

  /**
   * Function to set the number of columns for the HitList in the requester modal
   */
  setRequesterModalColumns: (columns: number) => void;
}
