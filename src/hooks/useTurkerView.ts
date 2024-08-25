import {
  ITurkerViewRequestersResponse,
  ITurkerViewRequester,
} from "@hit-spooner/api";
import { useState, useEffect, useRef, useCallback } from "react";

const turkerViewHeaders = new Headers([
  ["X-VIEW-KEY", ""],
  ["X-APP-KEY", "HIT Spooner"],
  ["X-APP-VER", "1.0.0"],
]);

interface RequesterCache {
  [key: string]: ITurkerViewRequester | undefined;
}

export const useTurkerView = (requesterIds: string[]) => {
  const [requesters, setRequesters] = useState<RequesterCache>({});
  const cachedRequesters = useRef<RequesterCache>({});

  /**
   * Fetches requester data from the TurkerView API.
   *
   * @param newRequesterIds - An array of requester IDs that need to be fetched.
   */
  const fetchRequesters = useCallback(async (newRequesterIds: string[]) => {
    if (newRequesterIds.length === 0) return;

    try {
      const response = await fetch(
        `https://view.turkerview.com/v1/requesters/?requester_ids=${newRequesterIds.join()}`,
        {
          method: "GET",
          cache: "no-cache",
          headers: turkerViewHeaders,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch requester data");
      }

      const turkerview =
        (await response.json()) as ITurkerViewRequestersResponse;
      const tvRequesters = turkerview.requesters;

      const fetchedRequesters: RequesterCache = {};
      newRequesterIds.forEach((reqid) => {
        if (tvRequesters[reqid]) {
          fetchedRequesters[reqid] = tvRequesters[reqid];
        } else {
          fetchedRequesters[reqid] = undefined;
        }
        cachedRequesters.current[reqid] = fetchedRequesters[reqid];
      });

      setRequesters((prevRequesters) => ({
        ...prevRequesters,
        ...fetchedRequesters,
      }));
    } catch (error) {
      console.error("Error fetching requester data:", error);
    }
  }, []);

  useEffect(() => {
    const newRequesterIds = requesterIds.filter(
      (id) => !(id in cachedRequesters.current)
    );

    fetchRequesters(newRequesterIds);
  }, [requesterIds]);

  /**
   * Exposes the method to fetch additional requester data by their IDs.
   *
   * @param ids - An array of requester IDs to fetch.
   */
  const fetchAdditionalRequesters = (ids: string[]) => {
    const newRequesterIds = ids.filter(
      (id) => !(id in cachedRequesters.current)
    );

    fetchRequesters(newRequesterIds);
  };

  return {
    requesters: { ...cachedRequesters.current, ...requesters },
    fetchAdditionalRequesters,
  };
};

export default useTurkerView;
