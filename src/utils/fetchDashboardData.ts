import { IDashboardData } from "@hit-spooner/api";
import axios from "axios";

export const fetchDashboardData = async (): Promise<IDashboardData> => {
  try {
    const response = await axios.get(
      "https://worker.mturk.com/dashboard?format=json"
    );
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch dashboard data.");
  }
};
