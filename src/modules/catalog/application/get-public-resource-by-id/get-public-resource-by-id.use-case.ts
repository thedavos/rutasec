import type { GetPublicResourceById } from "#/modules/catalog/application/get-public-resource-by-id/get-public-resource-by-id";
import type { CatalogResourceDetail } from "#/modules/catalog/domain/entities/resource";
import type { CatalogError } from "#/modules/catalog/domain/errors/catalog-errors";
import type { CatalogPort } from "#/modules/catalog/domain/ports/catalog-port";
import type { Result } from "#/shared/domain/result";

export class GetPublicResourceByIdUseCase implements GetPublicResourceById {
  constructor(private readonly catalog: CatalogPort) {}

  execute(id: string): Promise<Result<CatalogResourceDetail, CatalogError>> {
    return this.catalog.getPublishedById(id);
  }
}
