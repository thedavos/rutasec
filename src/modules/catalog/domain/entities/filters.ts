import {
  RESOURCE_LEVELS,
  RESOURCE_TYPES,
  type CatalogFilters,
  type CatalogListInput,
} from "#/modules/catalog/domain/entities/resource";

export function parseCatalogFilters(input?: CatalogListInput): CatalogFilters {
  if (!input) {
    return {};
  }

  const filters: CatalogFilters = {};

  const category = input.category?.trim();
  if (category) {
    filters.category = category;
  }

  if (input.level && RESOURCE_LEVELS.includes(input.level)) {
    filters.level = input.level;
  }

  if (input.resourceType && RESOURCE_TYPES.includes(input.resourceType)) {
    filters.resourceType = input.resourceType;
  }

  return filters;
}
