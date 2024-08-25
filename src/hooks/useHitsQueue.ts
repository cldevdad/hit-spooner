import { useState, useEffect } from "react";
import axios from "axios";
import { IHitAssignment } from "@hit-spooner/api";

export const useHitsQueue = () => {
  const [queue, setQueue] = useState<IHitAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const response = await axios.get(
          "https://worker.mturk.com/tasks/?format=json"
        );
        setQueue(response.data.tasks || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch queue data.");
        setLoading(false);
      }
    };

    fetchQueueData();
  }, []);

  return { queue, loading, error };
};
