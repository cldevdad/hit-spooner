import { IHitProject, IHitSearchFilter } from "@hit-spooner/api";
import { debounce } from "lodash";
import { create } from "zustand";
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
import { fetchDashboardData } from "../../utils";
import { useIndexedDb } from "../useIndexedDb";
import { IHitSpoonerStoreState } from "./IHitSpoonerStoreState";
import { LocalStorageKeys } from "./LocalStorageKeys";

const INDEXED_DB_BATCH_UPDATE_SIZE = 10;
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
  const { addOrUpdateHit, loadHitsByPage, deleteHitFromIndexedDb } =
    useIndexedDb();
  let intervalRef: NodeJS.Timeout | null = null;

  const safeParseInt = (value: string | null, defaultValue: number): number => {
    const parsed = parseInt(value || "");
    return isNaN(parsed) ? defaultValue : parsed;
  };

  const clearIntervals = () => {
    if (intervalRef) {
      clearInterval(intervalRef);
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
        1200
      ),
      setUpdateInterval: (interval: number) => {
        localStorage.setItem(
          LocalStorageKeys.UpdateInterval,
          interval.toString()
        );
        set((state) => ({
          config: { ...state.config, updateInterval: interval },
        }));
        clearIntervals(); // Clear existing intervals
        get().startUpdateIntervals(); // Start new intervals with updated setting
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
        const updatedBlockedRequesters = [
          ...state.blockedRequesters,
          requesterId,
        ];
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

      const filters = get().filters;
      const pageSize = filters.pageSize ? parseInt(filters.pageSize) : 50;

      set((state) => ({
        hits: { ...state.hits, loading: true },
      }));

      try {
        const [newHits, totalHits] = await loadHitsByPage(
          page,
          pageSize,
          filters
        );
        const blockedRequesters = get().blockedRequesters;

        const filteredNewHits = newHits.filter(
          (hit: IHitProject) => !blockedRequesters.includes(hit.requester_id)
        );

        const existingHits = get().hits.data || [];
        const updatedHits =
          page === 1 ? filteredNewHits : [...existingHits, ...filteredNewHits];

        set({
          hits: {
            data: updatedHits,
            loading: false,
            error: null,
            pageSize: filters.pageSize ? parseInt(filters.pageSize) : 50,
            currentPage: page,
            total: totalHits,
          },
        });
      } catch (error) {
        set({
          hits: {
            data: null,
            loading: false,
            pageSize: 0,
            currentPage: 0,
            total: 0,
            error: "Failed to fetch HITs",
          },
        });
      }
    }, MTURK_FETCH_DEBOUNCE_TIME),

    setHitsPage: async (page: number) => {
      const state = get();
      const { pageSize } = state.hits;
      const filters = state.filters; // Get the filters from the state

      set({ hits: { ...state.hits, loading: true, currentPage: page } });

      try {
        const [paginatedHits, totalHits] = await loadHitsByPage(
          page,
          pageSize ?? 50,
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

        set({
          queue: data.tasks || [],
          loadingQueue: false,
        });
      } catch (error) {
        console.error("Error fetching queue data:", error);
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
      if (hitsToAccept.length === 0) return;

      const hitToProcess = hitsToAccept[0];
      const { hit_set_id, accept_project_task_url } = hitToProcess;

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

        if (data?.state === "Assigned") {
          const hit = get().hits.data?.find((h) => h.hit_set_id === hit_set_id);

          switch (hit?.scoop) {
            case "scoop":
              get().removeHitFromAccept(hit_set_id);
              hit.scoop = undefined;
              await addOrUpdateHit(hit);
              break;

            case "shovel":
              hitsToAccept = hitsToAccept.slice(1);
              hitsToAccept.push(hitToProcess);
              set({ hitsToAccept });
              break;

            default:
              get().removeHitFromAccept(hit_set_id);
              break;
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
        debouncedAcceptHit(hit);
        resolve();
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

      await deleteHitFromIndexedDb(hitId);
    },

    startUpdateIntervals: () => {
      clearIntervals(); // Clear any existing intervals

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
        const task = taskQueue.shift();
        if (task) {
          task();
        }
      };

      const interval = get().config.updateInterval;

      addToQueue();
      intervalRef = setInterval(processQueue, interval);
      setInterval(addToQueue, interval * taskQueue.length);
    },
  };
});
