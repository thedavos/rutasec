import {
  buildFilterOptionsCacheKey,
  buildListPublishedCacheKey,
  buildResourceDetailCacheKey,
  CATALOG_CACHE_TTL_SECONDS,
} from "#/modules/catalog/adapters/cache/build-catalog-cache-key";
import type { CatalogCacheStore } from "#/modules/catalog/adapters/cache/catalog-cache-store";
import {
  catalogFilterOptionsSchema,
  catalogResourceCardListSchema,
  catalogResourceDetailSchema,
} from "#/modules/catalog/adapters/schemas/catalog-cache-payload.schema";
import type {
  CatalogFilterOptions,
  CatalogFilters,
  CatalogResourceCard,
  CatalogResourceDetail,
} from "#/modules/catalog/domain/entities/resource";
import type { CatalogError } from "#/modules/catalog/domain/errors/catalog-errors";
import type { CatalogPort } from "#/modules/catalog/domain/ports/catalog-port";
import { ok, type Result } from "#/shared/domain/result";

type CachedCatalogAdapterOptions = {
  ttlSeconds?: number;
};

function parseCachedList(value: string): Result<CatalogResourceCard[], CatalogError> | null {
  let json: unknown;
  try {
    json = JSON.parse(value);
  } catch {
    return null;
  }

  const parsed = catalogResourceCardListSchema.safeParse(json);
  if (!parsed.success) {
    return null;
  }

  return ok(parsed.data);
}

function parseCachedFilterOptions(
  value: string,
): Result<CatalogFilterOptions, CatalogError> | null {
  let json: unknown;
  try {
    json = JSON.parse(value);
  } catch {
    return null;
  }

  const parsed = catalogFilterOptionsSchema.safeParse(json);
  if (!parsed.success) {
    return null;
  }

  return ok(parsed.data);
}

function parseCachedDetail(value: string): Result<CatalogResourceDetail, CatalogError> | null {
  let json: unknown;
  try {
    json = JSON.parse(value);
  } catch {
    return null;
  }

  const parsed = catalogResourceDetailSchema.safeParse(json);
  if (!parsed.success) {
    return null;
  }

  return ok(parsed.data);
}

export function createCachedCatalogAdapter(
  inner: CatalogPort,
  cache: CatalogCacheStore,
  options: CachedCatalogAdapterOptions = {},
): CatalogPort {
  const ttlSeconds = options.ttlSeconds ?? CATALOG_CACHE_TTL_SECONDS;

  return {
    async listPublished(filters: CatalogFilters) {
      const key = buildListPublishedCacheKey(filters);
      const cached = await cache.get(key);
      if (cached !== null) {
        const parsed = parseCachedList(cached);
        if (parsed) {
          return parsed;
        }
      }

      const result = await inner.listPublished(filters);
      if (result.ok) {
        await cache.put(key, JSON.stringify(result.value), ttlSeconds);
      }

      return result;
    },

    async getFilterOptions() {
      const key = buildFilterOptionsCacheKey();
      const cached = await cache.get(key);
      if (cached !== null) {
        const parsed = parseCachedFilterOptions(cached);
        if (parsed) {
          return parsed;
        }
      }

      const result = await inner.getFilterOptions();
      if (result.ok) {
        await cache.put(key, JSON.stringify(result.value), ttlSeconds);
      }

      return result;
    },

    async getPublishedById(id: string) {
      const key = buildResourceDetailCacheKey(id);
      const cached = await cache.get(key);
      if (cached !== null) {
        const parsed = parseCachedDetail(cached);
        if (parsed) {
          return parsed;
        }
      }

      const result = await inner.getPublishedById(id);
      if (result.ok) {
        await cache.put(key, JSON.stringify(result.value), ttlSeconds);
      }

      return result;
    },
  };
}
