import type { GetPublicCatalog } from "#/modules/catalog/application/get-public-catalog/get-public-catalog";
import { parseCatalogFilters } from "#/modules/catalog/domain/entities/filters";
import type {
  CatalogListInput,
  PublicCatalogResult,
} from "#/modules/catalog/domain/entities/resource";
import type { CatalogError } from "#/modules/catalog/domain/errors/catalog-errors";
import type { CatalogPort } from "#/modules/catalog/domain/ports/catalog-port";
import { ok, type Result } from "#/shared/domain/result";

export class GetPublicCatalogUseCase implements GetPublicCatalog {
  constructor(private readonly catalog: CatalogPort) {}

  async execute(input?: CatalogListInput): Promise<Result<PublicCatalogResult, CatalogError>> {
    const filters = parseCatalogFilters(input);
    const resourcesResult = await this.catalog.listPublished(filters);
    if (!resourcesResult.ok) {
      return resourcesResult;
    }

    const filterOptionsResult = await this.catalog.getFilterOptions();
    if (!filterOptionsResult.ok) {
      return filterOptionsResult;
    }

    const resources = resourcesResult.value;
    return ok({
      resources,
      total: resources.length,
      filters,
      filterOptions: filterOptionsResult.value,
    });
  }
}
