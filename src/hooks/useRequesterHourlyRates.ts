import { ITurkerViewRequestersResponse } from "@hit-spooner/api";
import { useState, useEffect, useRef, useCallback } from "react";

const turkerViewHeaders = new Headers([
  ["X-VIEW-KEY", ""],
  ["X-APP-KEY", "HIT Spooner"],
  ["X-APP-VER", "1.0.0"],
]);

interface HourlyRateCache {
  [key: string]: string | undefined;
}

const CHUNK_SIZE = 100;
const DEBOUNCE_DELAY = 300; // milliseconds

export const useRequesterHourlyRates = (requesterIds: string[]) => {
  const [hourlyRates, setHourlyRates] = useState<HourlyRateCache>({});
  const cachedRequesterIds = useRef<HourlyRateCache>({});
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchHourlyRates = useCallback(async (newRequesterIds: string[]) => {
    if (newRequesterIds.length === 0) return;

    const fetchChunk = async (chunk: string[]) => {
      try {
        const response = await fetch(
          `https://view.turkerview.com/v1/requesters/?requester_ids=${chunk.join()}`,
          {
            method: "GET",
            cache: "no-cache",
            headers: turkerViewHeaders,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch hourly rates");
        }

        const turkerview =
          (await response.json()) as ITurkerViewRequestersResponse;
        const tvRequesters = turkerview.requesters;

        const rates: HourlyRateCache = {};
        chunk.forEach((reqid) => {
          if (
            tvRequesters[reqid] &&
            tvRequesters[reqid]["wages"]["average"]["wage"]
          ) {
            rates[
              reqid
            ] = `$${tvRequesters[reqid]["wages"]["average"]["wage"]}/hr`;
          } else {
            rates[reqid] = undefined;
          }
          cachedRequesterIds.current[reqid] = rates[reqid];
        });

        setHourlyRates((prevRates) => ({ ...prevRates, ...rates }));
      } catch (error) {
        console.error("Error fetching requester hourly rates:", error);
      }
    };

    const chunks = [];
    for (let i = 0; i < newRequesterIds.length; i += CHUNK_SIZE) {
      chunks.push(newRequesterIds.slice(i, i + CHUNK_SIZE));
    }

    for (const chunk of chunks) {
      await fetchChunk(chunk);
    }
  }, []);

  useEffect(() => {
    const newRequesterIds = requesterIds.filter(
      (id) => !(id in cachedRequesterIds.current)
    );

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchHourlyRates(newRequesterIds);
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [requesterIds, fetchHourlyRates]);

  return { ...cachedRequesterIds.current, ...hourlyRates };
};

export default useRequesterHourlyRates;
