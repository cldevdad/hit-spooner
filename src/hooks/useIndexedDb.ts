import { IHitProject, IHitSearchFilter } from "@hit-spooner/api";
import { openDB, IDBPDatabase } from "idb";

const DB_NAME = "hit-spooner-db";
const STORE_NAME = "hits";

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDb = (): Promise<IDBPDatabase> => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "hit_set_id" });
        }
      },
    });
  }
  return dbPromise;
};

export const clearAllHits = async (): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.clear();
  await tx.done;
};

export const addOrUpdateHit = async (hit: IHitProject): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, "readwrite", { durability: "relaxed" });
  const existingHit = await tx.store.get(hit.hit_set_id);
  await tx.store.put(existingHit ? { ...existingHit, ...hit } : hit);
  await tx.done;
};

export const addOrUpdateHits = async (hits: IHitProject[]): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, "readwrite", { durability: "relaxed" });
  const store = tx.store;

  for (const hit of hits) {
    const existingHit = await store.get(hit.hit_set_id);
    await store.put(existingHit ? { ...existingHit, ...hit } : hit);
  }
  await tx.done;
};

export const loadHits = async (filters: IHitSearchFilter): Promise<IHitProject[]> => {
  const db = await getDb();
  const allHits = await db.getAll(STORE_NAME);
  const minReward = filters.minReward ? parseFloat(filters.minReward) : 0;

  return minReward > 0
    ? allHits.filter((hit) => hit.monetary_reward?.amount_in_dollars >= minReward)
    : allHits;
};

export const loadHitsByPage = async (
  page: number,
  pageSize: number,
  filters: IHitSearchFilter
): Promise<[IHitProject[], number]> => {
  const allHits = await loadHits(filters);
  const startIndex = (page - 1) * pageSize;
  return [allHits.slice(startIndex, startIndex + pageSize), allHits.length];
};

export const deleteHit = async (hitId: string): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.delete(hitId);
  await tx.done;
};

export const purgeOldHits = async (): Promise<void> => {
  try {
    const db = await getDb();
    const allHits = await db.getAll(STORE_NAME);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const tx = db.transaction(STORE_NAME, "readwrite");
    for (const hit of allHits) {
      if (hit.last_seen && new Date(hit.last_seen) < sevenDaysAgo) {
        await tx.store.delete(hit.hit_set_id);
      }
    }
    await tx.done;
  } catch {
    // Silently handle purge errors to avoid console output
  }
};

export const useIndexedDb = () => ({
  addOrUpdateHit,
  addOrUpdateHits,
  clearAllHits,
  loadHits,
  loadHitsByPage,
  deleteHit,
  purgeOldHits,
});
