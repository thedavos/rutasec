import type { CatalogCacheStore } from "#/modules/catalog/adapters/cache/catalog-cache-store";

export function createKvCatalogCacheStore(kv: KVNamespace): CatalogCacheStore {
  return {
    async get(key) {
      return kv.get(key);
    },

    async put(key, value, ttlSeconds) {
      await kv.put(key, value, { expirationTtl: ttlSeconds });
    },
  };
}
