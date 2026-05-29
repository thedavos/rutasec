import type { ListCatalogResources } from "#/modules/catalog/application/list-catalog-resources/list-catalog-resources";
import type { ListCatalogResourcesResult } from "#/modules/catalog/application/list-catalog-resources/list-catalog-resources";
import { parseCatalogFilters } from "#/modules/catalog/domain/entities/filters";
import type { CatalogListInput } from "#/modules/catalog/domain/entities/resource";
import type { CatalogError } from "#/modules/catalog/domain/errors/catalog-errors";
import type { CatalogPort } from "#/modules/catalog/domain/ports/catalog-port";
import { ok, type Result } from "#/shared/domain/result";

export class ListCatalogResourcesUseCase implements ListCatalogResources {
  constructor(private readonly catalog: CatalogPort) {}

  async execute(
    input?: CatalogListInput,
  ): Promise<Result<ListCatalogResourcesResult, CatalogError>> {
    const filters = parseCatalogFilters(input);
    const resourcesResult = await this.catalog.listPublished(filters);
    if (!resourcesResult.ok) {
      return resourcesResult;
    }

    const resources = resourcesResult.value;
    return ok({
      resources,
      total: resources.length,
      filters,
    });
  }
}
