import type { GetCatalogFilterOptions } from "#/modules/catalog/application/get-catalog-filter-options/get-catalog-filter-options";
import type { CatalogFilterOptions } from "#/modules/catalog/domain/entities/resource";
import type { CatalogError } from "#/modules/catalog/domain/errors/catalog-errors";
import type { CatalogPort } from "#/modules/catalog/domain/ports/catalog-port";
import type { Result } from "#/shared/domain/result";

export class GetCatalogFilterOptionsUseCase implements GetCatalogFilterOptions {
  constructor(private readonly catalog: CatalogPort) {}

  execute(): Promise<Result<CatalogFilterOptions, CatalogError>> {
    return this.catalog.getFilterOptions();
  }
}
