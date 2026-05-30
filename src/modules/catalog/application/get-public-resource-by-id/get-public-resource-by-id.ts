import type { CatalogResourceDetail } from "#/modules/catalog/domain/entities/resource";
import type { CatalogError } from "#/modules/catalog/domain/errors/catalog-errors";
import type { Result } from "#/shared/domain/result";

export interface GetPublicResourceById {
  execute(id: string): Promise<Result<CatalogResourceDetail, CatalogError>>;
}
