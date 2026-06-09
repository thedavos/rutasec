import type { CatalogCacheStore } from "#/modules/catalog/adapters/cache/catalog-cache-store";

type CacheEntry = {
  value: string;
  expiresAt: number;
};

export function createMemoryCatalogCacheStore(now: () => number = Date.now): CatalogCacheStore {
  const entries = new Map<string, CacheEntry>();

  return {
    async get(key) {
      const entry = entries.get(key);
      if (!entry) {
        return null;
      }

      if (now() >= entry.expiresAt) {
        entries.delete(key);
        return null;
      }

      return entry.value;
    },

    async put(key, value, ttlSeconds) {
      entries.set(key, {
        value,
        expiresAt: now() + ttlSeconds * 1000,
      });
    },
  };
}
