import { IDashboardData } from "@hit-spooner/api";
import { fetchWithTimeout } from "./fetchWithTimeout";

const DASHBOARD_URL = "https://worker.mturk.com/dashboard?format=json";
const FETCH_TIMEOUT_MS = 10000;

export const fetchDashboardData = async (): Promise<IDashboardData> => {
  try {
    const { promise } = fetchWithTimeout(DASHBOARD_URL, {
      credentials: "include",
      redirect: "error"
    }, FETCH_TIMEOUT_MS);
    
    const response = await promise;

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Redirected");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    if (err.message === "Redirected" || err.name === "TypeError") {
      throw new Error("Redirected");
    }
    throw new Error("Failed to fetch dashboard data.");
  }
};
