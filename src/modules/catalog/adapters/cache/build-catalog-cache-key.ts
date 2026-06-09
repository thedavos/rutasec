import type { CatalogFilters } from "#/modules/catalog/domain/entities/resource";

export const CATALOG_CACHE_KEY_PREFIX = "catalog:" as const;
export const CATALOG_CACHE_TTL_SECONDS = 300;

function stableFiltersPayload(filters: CatalogFilters): string {
  return JSON.stringify({
    category: filters.category ?? "",
    level: filters.level ?? "",
    resourceType: filters.resourceType ?? "",
    q: filters.q ?? "",
  });
}

export function buildListPublishedCacheKey(filters: CatalogFilters): string {
  return `${CATALOG_CACHE_KEY_PREFIX}list:v1:${stableFiltersPayload(filters)}`;
}

export function buildFilterOptionsCacheKey(): string {
  return `${CATALOG_CACHE_KEY_PREFIX}filter-options:v1`;
}

export function buildResourceDetailCacheKey(id: string): string {
  return `${CATALOG_CACHE_KEY_PREFIX}detail:v1:${id.trim()}`;
}
