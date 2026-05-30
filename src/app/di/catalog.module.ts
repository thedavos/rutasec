import { createD1CatalogAdapter } from "#/modules/catalog/adapters/d1/d1-catalog-adapter";
import {
  GetCatalogFilterOptionsUseCase,
  GetPublicCatalogUseCase,
  GetPublicResourceByIdUseCase,
  ListCatalogResourcesUseCase,
} from "#/modules/catalog/application";
import { getDb } from "#/shared/db";

export type CatalogModule = {
  getPublicCatalog: GetPublicCatalogUseCase;
  listCatalogResources: ListCatalogResourcesUseCase;
  getCatalogFilterOptions: GetCatalogFilterOptionsUseCase;
  getPublicResourceById: GetPublicResourceByIdUseCase;
};

export function createCatalogModule(db: D1Database): CatalogModule {
  const catalog = createD1CatalogAdapter(db);

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
