import { describe, expect, it } from "vite-plus/test";

import {
  buildFilterOptionsCacheKey,
  buildListPublishedCacheKey,
  buildResourceDetailCacheKey,
  CATALOG_CACHE_KEY_PREFIX,
} from "#/modules/catalog/adapters/cache/build-catalog-cache-key";

describe("buildCatalogCacheKey", () => {
  it("uses a shared prefix for all catalog cache keys", () => {
    expect(buildFilterOptionsCacheKey().startsWith(CATALOG_CACHE_KEY_PREFIX)).toBe(true);
    expect(buildListPublishedCacheKey({}).startsWith(CATALOG_CACHE_KEY_PREFIX)).toBe(true);
    expect(buildResourceDetailCacheKey("res-1").startsWith(CATALOG_CACHE_KEY_PREFIX)).toBe(true);
  });

  it("builds stable list keys for equivalent filters", () => {
    const first = buildListPublishedCacheKey({
      category: "Networking",
      level: "beginner",
    });
    const second = buildListPublishedCacheKey({
      category: "Networking",
      level: "beginner",
    });

    expect(first).toBe(second);
  });

  it("builds different list keys when filters differ", () => {
    const empty = buildListPublishedCacheKey({});
    const filtered = buildListPublishedCacheKey({ category: "Networking" });

    expect(empty).not.toBe(filtered);
  });

  it("builds a fixed filter options key", () => {
    expect(buildFilterOptionsCacheKey()).toBe(`${CATALOG_CACHE_KEY_PREFIX}filter-options:v1`);
  });

  it("trims resource ids in detail keys", () => {
    expect(buildResourceDetailCacheKey("  res-1  ")).toBe(
      `${CATALOG_CACHE_KEY_PREFIX}detail:v1:res-1`,
    );
  });
});
