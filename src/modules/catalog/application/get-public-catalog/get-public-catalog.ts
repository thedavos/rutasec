import type {
  CatalogListInput,
  PublicCatalogResult,
} from "#/modules/catalog/domain/entities/resource";
import type { CatalogError } from "#/modules/catalog/domain/errors/catalog-errors";
import type { Result } from "#/shared/domain/result";

export interface GetPublicCatalog {
  execute(input?: CatalogListInput): Promise<Result<PublicCatalogResult, CatalogError>>;
}
