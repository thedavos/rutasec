import { createMemoryCatalogCacheStore } from "#/modules/catalog/adapters/cache/memory-catalog-cache-store";
import { createKvCatalogCacheStore } from "#/modules/catalog/adapters/cache/kv-catalog-cache-store";
import type { CatalogCacheStore } from "#/modules/catalog/adapters/cache/catalog-cache-store";
import { env } from "cloudflare:workers";

let memoryFallbackStore: CatalogCacheStore | undefined;

export function getCatalogCacheStore(): CatalogCacheStore {
  if (env.CATALOG_CACHE) {
    return createKvCatalogCacheStore(env.CATALOG_CACHE);
  }

  if (!memoryFallbackStore) {
    memoryFallbackStore = createMemoryCatalogCacheStore();
  }

  return memoryFallbackStore;
}

export function resetCatalogCacheStoreForTests(): void {
  memoryFallbackStore = undefined;
}
