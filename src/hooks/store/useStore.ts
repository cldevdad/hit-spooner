import { IHitProject, IHitSearchFilter, IHitAssignment } from "@hit-spooner/api";
import { debounce } from "lodash";
import { create } from "zustand";
import { notifications } from "@mantine/notifications";
import {
  darkTheme,
  lightTheme,
  pinkTheme,
  greenTheme,
  purpleTheme,
  steelTheme,
  newsTheme,
  blueTheme,
} from "../../styles/themes";
import { fetchDashboardData, fetchHITProjects, announceHitCaught, SoundType, playSound, safeParseInt } from "../../utils";
import { useIndexedDb, loadHits as loadHitsFromDb } from "../useIndexedDb";
import { IHitSpoonerStoreState } from "./IHitSpoonerStoreState";
import { LocalStorageKeys } from "./LocalStorageKeys";

// Helper selectors for queue earnings calculations
export const useTotalEarnings = (state: any) =>
  state.queue.reduce((total: number, assignment: any) => {
    return total + assignment.project.monetary_reward.amount_in_dollars;
  }, 0);

export const useTotalEarningsPerHour = (state: any) => {
  const totalReward = state.queue.reduce((total: number, assignment: any) => {
    return total + assignment.project.monetary_reward.amount_in_dollars;
  }, 0);

  const totalDurationHours = state.queue.reduce((total: number, assignment: any) => {
    const durationSeconds = assignment.project.assignment_duration_in_seconds || 0;
    return total + (durationSeconds / 3600); // Convert to hours
  }, 0);

  return totalDurationHours > 0 ? totalReward / totalDurationHours : 0;
};

export const useAverageRewardPerHit = (state: any) => {
  const totalReward = state.queue.reduce((total: number, assignment: any) => {
    return total + assignment.project.monetary_reward.amount_in_dollars;
  }, 0);

  return state.queue.length > 0 ? totalReward / state.queue.length : 0;
};

export const useTotalDuration = (state: any) => {
  return state.queue.reduce((total: number, assignment: any) => {
    const durationSeconds = assignment.project.assignment_duration_in_seconds || 0;
    return total + durationSeconds;
  }, 0);
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MTURK_FETCH_DEBOUNCE_TIME = 80;

const defaultHitFilters: IHitSearchFilter = {
  qualified: true,
  masters: false,
  minReward: "0.01",
  sort: "updated_desc",
  pageSize: "50",
  currentPage: 1,
};

export const useStore = create<IHitSpoonerStoreState>((set, get) => {
  const { addOrUpdateHit, addOrUpdateHits, loadHitsByPage, deleteHit, purgeOldHits } =
    useIndexedDb();
  let intervalRef: NodeJS.Timeout | null = null;
  let addQueueIntervalRef: NodeJS.Timeout | null = null;

  const clearIntervals = () => {
    if (intervalRef) {
      clearInterval(intervalRef);
      intervalRef = null;
    }
    if (addQueueIntervalRef) {
      clearInterval(addQueueIntervalRef);
      addQueueIntervalRef = null;
    }
  };

  const debouncedAcceptHit = debounce(async (hit: IHitProject) => {
    if (get().paused) return;

    try {
      const response = await fetch(
        `${hit.accept_project_task_url}&format=json`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 422) {
          return;
        }
        return;
      }

      const data = await response.json();

        // Successfully fetched queue - user is logged in
        get().setLoggedIn(true);

      if (data?.state === "Assigned") {
        hit.unavailable = true;
        await addOrUpdateHit(hit);
        get().removeHitFromAccept(hit.hit_set_id);
      }
    } catch (error) {
      // Handle network errors silently
    }
  }, MTURK_FETCH_DEBOUNCE_TIME);

  return {
    hits: {
      data: null,
      loading: true,
      error: null,
      currentPage: 1,
      total: 0,
    },
    dashboard: {
      data: null,
      loading: true,
      error: null,
    },
    queue: [],
    loadingQueue: false,
    blockedRequesters: JSON.parse(
      localStorage.getItem(LocalStorageKeys.BlockedRequesters) || "[]"
    ),
    favoriteRequesters: JSON.parse(
      localStorage.getItem(LocalStorageKeys.FavoriteRequesters) || "[]"
    ),
    filters: JSON.parse(
      localStorage.getItem(LocalStorageKeys.HitSearchFilters) ??
      JSON.stringify(defaultHitFilters)
    ),
    paused: false,
    hitsToAccept: [],
    isLoggedIn: false,
    setLoggedIn: (loggedIn: boolean) => {
      set({ isLoggedIn: loggedIn });
    },

    config: {
      theme: localStorage.getItem(LocalStorageKeys.Theme) || "light",
      themes: {
        light: lightTheme,
        dark: darkTheme,
        blue: blueTheme,
        pink: pinkTheme,
        green: greenTheme,
        purple: purpleTheme,
        steel: steelTheme,
        news: newsTheme,
      },
      setTheme: (newTheme) => {
        localStorage.setItem(LocalStorageKeys.Theme, newTheme);
        chrome.storage.sync.set({ theme: newTheme });

        set((state) => ({
          config: { ...state.config, theme: newTheme },
        }));
      },
      workspacePanelSizes: JSON.parse(
        localStorage.getItem(LocalStorageKeys.WorkspacePanelSizes) ||
        "[0.3, 0.7]"
      ),
      setWorkspacePanelSizes: debounce((sizes: number[]) => {
        localStorage.setItem(
          LocalStorageKeys.WorkspacePanelSizes,
          JSON.stringify(sizes)
        );
        set((state) => ({
          config: { ...state.config, workspacePanelSizes: sizes },
        }));
      }, 100),

      workspaceListSizes: JSON.parse(
        localStorage.getItem(LocalStorageKeys.WorkspaceListSizes) ||
        "[0.5, 0.5]"
      ),
      setWorkspaceListSizes: debounce((sizes: number[]) => {
        localStorage.setItem(
          LocalStorageKeys.WorkspaceListSizes,
          JSON.stringify(sizes)
        );
        set((state) => ({
          config: { ...state.config, workspaceListSizes: sizes },
        }));
      }, 100),

      hitTaskViewPanelSizes: JSON.parse(
        localStorage.getItem(LocalStorageKeys.TaskViewPanelSizes) ||
        "[0.8, 0.2]"
      ),
      setHitTaskViewPanelSizes: debounce((sizes) => {
        localStorage.setItem(
          LocalStorageKeys.TaskViewPanelSizes,
          JSON.stringify(sizes)
        );
        set((state) => ({
          config: { ...state.config, hitTaskViewPanelSizes: sizes },
        }));
      }, 100),

      workspaceAvailableColumns: safeParseInt(
        localStorage.getItem(LocalStorageKeys.WorkspaceAvailableColumns),
        3
      ),
      setWorkspaceAvailableColumns: (columns: number) => {
        localStorage.setItem(
          LocalStorageKeys.WorkspaceAvailableColumns,
          columns.toString()
        );
        set((state) => ({
          config: { ...state.config, workspaceAvailableColumns: columns },
        }));
      },

      workspaceUnavailableColumns: safeParseInt(
        localStorage.getItem(LocalStorageKeys.WorkspaceUnavailableColumns),
        3
      ),
      setWorkspaceUnavailableColumns: (columns: number) => {
        localStorage.setItem(
          LocalStorageKeys.WorkspaceUnavailableColumns,
          columns.toString()
        );
        set((state) => ({
          config: { ...state.config, workspaceUnavailableColumns: columns },
        }));
      },

      requesterModalColumns: safeParseInt(
        localStorage.getItem(LocalStorageKeys.RequesterModalColumns),
        3
      ),
      setRequesterModalColumns: (columns: number) => {
        localStorage.setItem(
          LocalStorageKeys.RequesterModalColumns,
          columns.toString()
        );
        set((state) => ({
          config: { ...state.config, requesterModalColumns: columns },
        }));
      },

      updateInterval: safeParseInt(
        localStorage.getItem(LocalStorageKeys.UpdateInterval),
        800
      ),
      setUpdateInterval: (interval: number) => {
        localStorage.setItem(
          LocalStorageKeys.UpdateInterval,
          interval.toString()
        );
        set((state) => ({
          config: { ...state.config, updateInterval: interval },
        }));
        clearIntervals();
        get().startUpdateIntervals();
      },

      soundEnabled:
        localStorage.getItem(LocalStorageKeys.SoundEnabled) !== "false",
      setSoundEnabled: (enabled: boolean) => {
        localStorage.setItem(LocalStorageKeys.SoundEnabled, String(enabled));
        set((state) => ({
          config: { ...state.config, soundEnabled: enabled },
        }));
      },

      soundType: localStorage.getItem(LocalStorageKeys.SoundType) || "chime",
      setSoundType: (soundType: string) => {
        localStorage.setItem(LocalStorageKeys.SoundType, soundType);
        set((state) => ({
          config: { ...state.config, soundType },
        }));
      },
    },

    setFilters: (newFilters: IHitSearchFilter) => {
      set({ filters: newFilters });
      localStorage.setItem(
        LocalStorageKeys.HitSearchFilters,
        JSON.stringify(newFilters)
      );
    },

    blockRequester: (requesterId: string) => {
      set((state) => {
        const isAlreadyBlocked = state.blockedRequesters.some(
          (r) => r === requesterId
        );

        let updatedBlockedRequesters;
        if (isAlreadyBlocked) {
          updatedBlockedRequesters = state.blockedRequesters.filter(
            (r) => r !== requesterId
          );
        } else {
          updatedBlockedRequesters = [...state.blockedRequesters, requesterId];
        }

        localStorage.setItem(
          LocalStorageKeys.BlockedRequesters,
          JSON.stringify(updatedBlockedRequesters)
        );

        return { blockedRequesters: updatedBlockedRequesters };
      });
    },

    toggleFavoriteRequester: (requesterId: string, requesterName: string) => {
      set((state) => {
        const isAlreadyFavorite = state.favoriteRequesters.some(
          (r) => r.id === requesterId
        );

        let updatedFavorites;
        if (isAlreadyFavorite) {
          updatedFavorites = state.favoriteRequesters.filter(
            (r) => r.id !== requesterId
          );
        } else {
          updatedFavorites = [
            ...state.favoriteRequesters,
            { id: requesterId, name: requesterName },
          ];
        }

        localStorage.setItem(
          LocalStorageKeys.FavoriteRequesters,
          JSON.stringify(updatedFavorites)
        );

        return { favoriteRequesters: updatedFavorites };
      });
    },

    togglePause: () => {
      set((state) => ({
        paused: !state.paused,
      }));
    },

    fetchAndUpdateHits: debounce(async (page = 1) => {
      if (get().paused) return;

      set((state) => ({
        hits: { ...state.hits, loading: true },
      }));

      try {
        const allCachedHits = await loadHitsFromDb(get().filters);
        const hitMap = new Map<string, IHitProject>();
        const hitsToAcceptSet = new Set(get().hitsToAccept.map(h => h.hit_set_id));

        for (const hit of allCachedHits) {
          hitMap.set(hit.hit_set_id, hit);
        }

        let filteredHits: IHitProject[] = [];
        let fetchError: string | null = null;

        try {
          const fetchedHits = await fetchHITProjects(get().filters);
          // Successfully fetched HITs - user is logged in
          get().setLoggedIn(true);
          const blockedRequestersSet = new Set(get().blockedRequesters);
          filteredHits = fetchedHits.filter(
            (hit: IHitProject) => !blockedRequestersSet.has(hit.requester_id)
          );

          for (const hit of filteredHits) {
            const cachedHit = hitMap.get(hit.hit_set_id);
            hit.unavailable = false;
            if (cachedHit && (cachedHit.scoop === "scoop" || cachedHit.scoop === "shovel")) {
              hit.scoop = cachedHit.scoop;
            }
            if (hit.scoop && !hit.unavailable && !hitsToAcceptSet.has(hit.hit_set_id)) {
              get().addHitToAccept(hit);
            }
            hitMap.set(hit.hit_set_id, hit);
          }

          for (const [hitId, cachedHit] of hitMap) {
            if (!filteredHits.some((hit: IHitProject) => hit.hit_set_id === hitId)) {
              cachedHit.unavailable = true;
            }
          }

          // Batch update database - ONLY write what changed to prevent flooding
          try {
            const hitsToUpdate = [...filteredHits];
            const newlyUnavailable = Array.from(hitMap.values()).filter(h => h.unavailable && !allCachedHits.find(ch => ch.hit_set_id === h.hit_set_id && ch.unavailable));
            hitsToUpdate.push(...newlyUnavailable);

            if (hitsToUpdate.length > 0) {
              await addOrUpdateHits(hitsToUpdate);
            }

            if (Math.random() < 0.05) {
              await get().purgeOldHits();
            }
          } catch (dbError) {
            // Silently handle database errors to avoid console output
          }

        } catch (error: any) {
          // Silently handle fetch errors to avoid console output
          fetchError = error?.message === "Redirected" || error?.name === "TypeError"
            ? "Session expired? Please log in to MTurk."
            : "Failed to fetch HITs";
        }

        const allHits = Array.from(hitMap.values());

        // Limit state size to prevent memory leaks and UI lag
        const available = allHits.filter(h => h && !h.unavailable);
        const unavailable = allHits
          .filter(h => h && h.unavailable)
          .sort((a, b) => {
            const timeA = new Date(a.last_updated_time || a.last_seen || a.creation_time || 0).getTime();
            const timeB = new Date(b.last_updated_time || b.last_seen || b.creation_time || 0).getTime();
            return timeB - timeA;
          })
          .slice(0, 500);

        const limitedHits = [...available, ...unavailable];

        set({
          hits: {
            data: limitedHits,
            loading: false,
            error: fetchError,
          },
        });
      } catch (globalError) {
        // Silently handle critical errors to avoid console output
        set((state) => ({
          hits: { ...state.hits, loading: false, error: "Critical error. See console." },
        }));
      }
    }, MTURK_FETCH_DEBOUNCE_TIME),

    setHitsPage: async (page: number) => {
      const state = get();
      const filters = state.filters;
      const pageSize = safeParseInt(state.filters.pageSize, 50);

      set({ hits: { ...state.hits, loading: true, currentPage: page } });

      try {
        const [paginatedHits, totalHits] = await loadHitsByPage(
          page,
          pageSize,
          filters
        );
        set({
          hits: {
            ...state.hits,
            data: paginatedHits,
            loading: false,
            total: totalHits,
          },
        });
      } catch (error) {
        set({
          hits: { ...state.hits, loading: false, error: "Failed to load page" },
        });
      }
    },

    fetchAndUpdateHitsQueue: debounce(async () => {
      set({ loadingQueue: true });

      try {
        const response = await fetch(
          "https://worker.mturk.com/tasks/?format=json",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch queue data.");
        }

        const data = await response.json();

        // Successfully fetched queue - user is logged in
        get().setLoggedIn(true);

        set({
          queue: data.tasks || [],
          loadingQueue: false,
        });
      } catch (error) {
        set({ loadingQueue: false });
      }
    }, MTURK_FETCH_DEBOUNCE_TIME),

    fetchAndUpdateDashboard: debounce(async () => {
      set((state) => ({
        dashboard: { ...state.dashboard, loading: true },
      }));

      try {
        const dashboardData = await fetchDashboardData();
        set({
          dashboard: { data: dashboardData, loading: false, error: null },
        });
      } catch (error) {
        set({
          dashboard: {
            data: null,
            loading: false,
            error: "Failed to fetch dashboard data",
          },
        });
      }
    }, MTURK_FETCH_DEBOUNCE_TIME),

    addOrUpdateHit: debounce(async (hit: IHitProject) => {
      if (get().paused) return;

      const hits = get().hits.data || [];
      const updatedHits = hits.map((h) =>
        h.hit_set_id === hit.hit_set_id ? hit : h
      );

      set({
        hits: { data: updatedHits, loading: false, error: null },
      });

      await addOrUpdateHit(hit);
    }, MTURK_FETCH_DEBOUNCE_TIME),

    addHitToAccept: debounce((hit: IHitProject) => {
      if (get().paused) return;

      set((state) => {
        const existing = state.hitsToAccept.find(
          (h) => h.hit_set_id === hit.hit_set_id
        );
        if (!existing) {
          return {
            hitsToAccept: [...state.hitsToAccept, hit],
          };
        }
        return state;
      });
    }, MTURK_FETCH_DEBOUNCE_TIME),

    removeHitFromAccept: debounce((hit_set_id: string) => {
      set((state) => ({
        hitsToAccept: state.hitsToAccept.filter(
          (h) => h.hit_set_id !== hit_set_id
        ),
      }));
    }, MTURK_FETCH_DEBOUNCE_TIME),

    handleAutomaticAcceptance: debounce(async () => {
      if (get().paused) return;

      let hitsToAccept = get().hitsToAccept;
      if (hitsToAccept.length === 0) {
        return;
      }

      const hitToProcess = hitsToAccept[0];
      const { hit_set_id, accept_project_task_url } = hitToProcess;

      const currentHit = get().hits.data?.find((h) => h.hit_set_id === hit_set_id);
      if (!currentHit?.scoop) {
        get().removeHitFromAccept(hit_set_id);
        return;
      }

      try {
        const response = await fetch(`${accept_project_task_url}&format=json`, {
          credentials: "include",
        });

        let data;
        try {
          data = await response.json();
        } catch (error) {
          data = null;
        }

        const isSuccess = response.status === 200 && (data?.state === "Assigned" || data === null);

        if (isSuccess) {
          if (get().config.soundEnabled && currentHit) {
            announceHitCaught(get().config.soundType as SoundType);
          } else {
            playSound('chime');
          }
          switch (currentHit?.scoop) {
            case "scoop":
              get().removeHitFromAccept(hit_set_id);
              currentHit.scoop = undefined;
              currentHit.unavailable = true;
              await addOrUpdateHit(currentHit);
              break;

            case "shovel":
              currentHit.unavailable = true;
              await addOrUpdateHit(currentHit);
              hitsToAccept = hitsToAccept.slice(1);
              hitsToAccept.push(hitToProcess);
              set({ hitsToAccept });
              break;

            default:
              get().removeHitFromAccept(hit_set_id);
              break;
          }
        } else if (response.status === 422 && data?.message?.includes("no more")) {
          get().removeHitFromAccept(hit_set_id);
          if (currentHit) {
            currentHit.unavailable = true;
            await addOrUpdateHit(currentHit);
          }
        } else {
          hitsToAccept = hitsToAccept.slice(1);
          hitsToAccept.push(hitToProcess);
          set({ hitsToAccept });
        }
      } catch (error) {
        hitsToAccept = hitsToAccept.slice(1);
        hitsToAccept.push(hitToProcess);
        set({ hitsToAccept });
      }
    }, MTURK_FETCH_DEBOUNCE_TIME),

    acceptHit: (hit: IHitProject) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          debouncedAcceptHit(hit);
          resolve();
        }, 100);
      });
    },

    deleteHit: async (hitId: string) => {
      set((state) => ({
        hits: {
          ...state.hits,
          data:
            state.hits.data?.filter((hit) => hit.hit_set_id !== hitId) || [],
        },
      }));

      await deleteHit(hitId);
    },

    startUpdateIntervals: () => {
      clearIntervals();

      const fetchAndUpdateHits = get().fetchAndUpdateHits;
      const fetchAndUpdateDashboard = get().fetchAndUpdateDashboard;
      const handleAutomaticAcceptance = get().handleAutomaticAcceptance;
      const fetchAndUpdateHitsQueue = get().fetchAndUpdateHitsQueue;

      const taskWeights = {
        fetchAndUpdateHitsQueue: 1,
        fetchAndUpdateHits: 3,
        handleAutomaticAcceptance: 2,
        fetchAndUpdateDashboard: 1,
      };

      const taskQueue: (() => void)[] = [];

      const addToQueue = () => {
        for (let i = 0; i < taskWeights.fetchAndUpdateHitsQueue; i++) {
          taskQueue.push(fetchAndUpdateHitsQueue);
        }
        for (let i = 0; i < taskWeights.fetchAndUpdateHits; i++) {
          taskQueue.push(() => {
            if (!get().paused) {
              fetchAndUpdateHits();
            }
          });
        }
        for (let i = 0; i < taskWeights.handleAutomaticAcceptance; i++) {
          taskQueue.push(() => {
            if (!get().paused) {
              handleAutomaticAcceptance();
            }
          });
        }
        for (let i = 0; i < taskWeights.fetchAndUpdateDashboard; i++) {
          taskQueue.push(fetchAndUpdateDashboard);
        }
      };

      const processQueue = () => {
        if (taskQueue.length === 0) return;
        // Process multiple tasks per cycle for faster hit catching
        const tasksToProcess = Math.min(taskQueue.length, 4);
        for (let i = 0; i < tasksToProcess; i++) {
          const task = taskQueue.shift();
          if (task) {
            task();
          }
        }
      };

      const interval = get().config.updateInterval;

      addToQueue();
      intervalRef = setInterval(processQueue, interval);
      addQueueIntervalRef = setInterval(addToQueue, interval * taskQueue.length);
    },

    purgeOldHits: async () => {
      await purgeOldHits();
    },

    reorderQueue: (fromIndex: number, toIndex: number) => {
      set((state) => {
        const newQueue = [...state.queue];
        const [removed] = newQueue.splice(fromIndex, 1);
        newQueue.splice(toIndex, 0, removed);
        return { queue: newQueue };
      });
    },

    prioritizeQueueItem: (index: number) => {
      set((state) => {
        if (index <= 0) return state;
        const newQueue = [...state.queue];
        const [removed] = newQueue.splice(index, 1);
        newQueue.unshift(removed);
        return { queue: newQueue };
      });
    },
  };
});
