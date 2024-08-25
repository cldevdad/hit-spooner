import { IHitProject, IHitSearchFilter } from "@hit-spooner/api";
import { openDB } from "idb";

const DB_NAME = "hit-spooner-db";
const STORE_NAME = "hits";

/**
 * Opens the IndexedDB database, creating it if it doesn't exist.
 *
 * @returns {Promise<IDBPDatabase<unknown>>} - The opened database instance.
 */
async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "hit_set_id" });
      }
    },
  });
}

/**
 * Adds or updates a HIT in IndexedDB with relaxed durability. If the HIT
 * already exists, it updates it; otherwise, it adds it.
 *
 * @param {IHitProject} hit - The HIT to add or update.
 * @returns {Promise<void>} - Resolves when the operation is complete.
 */
export const addOrUpdateHit = async (hit: IHitProject): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, "readwrite", {
    durability: "relaxed",
  });
  const store = tx.objectStore(STORE_NAME);

  const existingHit = await store.get(hit.hit_set_id);

  if (existingHit) {
    // Update existing HIT
    await store.put({ ...existingHit, ...hit });
  } else {
    // Add new HIT
    await store.add(hit);
  }

  await tx.done;
};

/**
 * Loads all HITs from IndexedDB, including unavailable ones.
 *
 * @param {IHitSearchFilter} filters - The filters to apply to the HIT search.
 * @returns {Promise<IHitProject[]>} - The list of HITs.
 */
export const loadHits = async (
  filters: IHitSearchFilter
): Promise<IHitProject[]> => {
  const db = await getDb();
  const allHits = await db.getAll(STORE_NAME);

  // Apply your filtering logic here based on the filters parameter
  return allHits.filter((hit) => {
    let matches = true;

    if (filters.qualified !== undefined) {
      matches = matches && hit.qualified === filters.qualified;
    }

    if (filters.masters !== undefined) {
      matches = matches && hit.masters === filters.masters;
    }

    if (filters.minReward !== undefined) {
      matches =
        matches &&
        hit.monetary_reward.amount_in_dollars >= parseFloat(filters.minReward);
    }

    return matches;
  });
};

/**
 * Loads HITs from IndexedDB with pagination support.
 *
 * @param {number} page - The page number to load.
 * @param {number} pageSize - The number of HITs per page.
 * @param {IHitSearchFilter} filters - The filters to apply to the HIT search.
 * @returns {Promise<[IHitProject[], number]>} - The HITs for the page and total HIT count.
 */
export const loadHitsByPage = async (
  page: number,
  pageSize: number,
  filters: IHitSearchFilter
): Promise<[IHitProject[], number]> => {
  const allHits = await loadHits(filters);

  const startIndex = (page - 1) * pageSize;
  const paginatedHits = allHits.slice(startIndex, startIndex + pageSize);

  return [paginatedHits, allHits.length];
};

/**
 * Deletes a HIT from IndexedDB.
 *
 * @param {string} hitId - The ID of the HIT to delete.
 * @returns {Promise<void>} - Resolves when the HIT is deleted.
 */
export const deleteHit = async (hitId: string): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  await store.delete(hitId);

  await tx.done;
};

/**
 * Custom hook for interacting with IndexedDB for HITs, including paginated loading.
 *
 * Provides methods to add, update, load, load by page, and delete HITs.
 */
export const useIndexedDb = () => {
  return {
    addOrUpdateHit,
    loadHits,
    loadHitsByPage,
    deleteHitFromIndexedDb: deleteHit,
  };
};

export default useIndexedDb;
