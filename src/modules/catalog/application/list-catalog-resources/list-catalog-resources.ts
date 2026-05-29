import type {
  CatalogFilters,
  CatalogListInput,
  CatalogResourceCard,
} from "#/modules/catalog/domain/entities/resource";
import type { CatalogError } from "#/modules/catalog/domain/errors/catalog-errors";
import type { Result } from "#/shared/domain/result";

export type ListCatalogResourcesResult = {
  resources: CatalogResourceCard[];
  total: number;
  filters: CatalogFilters;
};

export interface ListCatalogResources {
  execute(input?: CatalogListInput): Promise<Result<ListCatalogResourcesResult, CatalogError>>;
}
