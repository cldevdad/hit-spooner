import { IHitAssignment } from "@hit-spooner/api";
import axios from "axios";
import { useEffect, useState } from "react";

export const useActivityData = () => {
  const [activityData, setActivityData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const today = new Date();
        const yesterday = new Date(today);
        const twoDaysAgo = new Date(today);

        yesterday.setDate(today.getDate() - 1);
        twoDaysAgo.setDate(today.getDate() - 2);

        const formatDate = (date: Date) => date.toISOString().split("T")[0];

        const urls = [
          `https://worker.mturk.com/status_details/${formatDate(
            today
          )}?format=json`,
          `https://worker.mturk.com/status_details/${formatDate(
            yesterday
          )}?format=json`,
          // `https://worker.mturk.com/status_details/${formatDate(
          //   twoDaysAgo
          // )}?format=json`,
        ];

        // Fetching data for the last three days
        const responses = await Promise.allSettled(
          urls.map((url) => axios.get(url))
        );

        const combinedResults = responses.flatMap((result) => {
          if (result.status === "fulfilled") {
            return result.value.data.results || [];
          } else {
            console.warn("Failed to fetch data for a day:", result.reason);
            return [];
          }
        });

        const activityMap: Record<string, number> = {};

        combinedResults.forEach((assignment: IHitAssignment) => {
          const key = `${assignment.project.requester_id}-${assignment.project.title}-${assignment.project.monetary_reward.amount_in_dollars}`;
          activityMap[key] = (activityMap[key] || 0) + 1;
        });

        setActivityData(activityMap);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch activity data.");
        setLoading(false);
      }
    };

    fetchActivityData();
  }, []);

  return { activityData, loading, error };
};

export default useActivityData;
