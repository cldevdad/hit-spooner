// Safe localStorage utilities
export const safeLocalStorageGet = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.warn(`Failed to parse localStorage item for key "${key}":`, error);
    return defaultValue;
  }
};

export const safeLocalStorageSet = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to set localStorage item for key "${key}":`, error);
  }
};

export { fetchDashboardData } from "./fetchDashboardData";
export { fetchHITProjects } from "./fetchHITProjects";
export { fetchWithTimeout } from "./fetchWithTimeout";
export { filterHitProjects } from "./filterHITProjects";
export { groupByWeek } from "./groupByWeek";
export { safeParseInt } from "./safeParseInt";
