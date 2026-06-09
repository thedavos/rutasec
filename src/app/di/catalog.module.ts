import { createCachedCatalogAdapter } from "#/modules/catalog/adapters/cache/cached-catalog-adapter";
import { createD1CatalogAdapter } from "#/modules/catalog/adapters/d1/d1-catalog-adapter";
import {
  GetCatalogFilterOptionsUseCase,
  GetPublicCatalogUseCase,
  GetPublicResourceByIdUseCase,
  ListCatalogResourcesUseCase,
} from "#/modules/catalog/application";
import { getCatalogCacheStore } from "#/shared/catalog-cache";
import { getDb } from "#/shared/db";

export type CatalogModule = {
  getPublicCatalog: GetPublicCatalogUseCase;
  listCatalogResources: ListCatalogResourcesUseCase;
  getCatalogFilterOptions: GetCatalogFilterOptionsUseCase;
  getPublicResourceById: GetPublicResourceByIdUseCase;
};

export function createCatalogModule(db: D1Database): CatalogModule {
  const catalog = createCachedCatalogAdapter(createD1CatalogAdapter(db), getCatalogCacheStore());

  return {
    getPublicCatalog: new GetPublicCatalogUseCase(catalog),
    listCatalogResources: new ListCatalogResourcesUseCase(catalog),
    getCatalogFilterOptions: new GetCatalogFilterOptionsUseCase(catalog),
    getPublicResourceById: new GetPublicResourceByIdUseCase(catalog),
  };
}

export function getCatalogModule(): CatalogModule {
  return createCatalogModule(getDb());
}
