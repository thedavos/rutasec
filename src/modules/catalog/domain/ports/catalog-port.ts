import type {
  CatalogFilterOptions,
  CatalogFilters,
  CatalogResourceCard,
} from "#/modules/catalog/domain/entities/resource";
import type { CatalogError } from "#/modules/catalog/domain/errors/catalog-errors";
import type { Result } from "#/shared/domain/result";

export interface CatalogPort {
  listPublished(filters: CatalogFilters): Promise<Result<CatalogResourceCard[], CatalogError>>;
  getFilterOptions(): Promise<Result<CatalogFilterOptions, CatalogError>>;
}
