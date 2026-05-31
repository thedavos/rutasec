import type { CatalogPort } from "#/modules/catalog/domain/ports/catalog-port";
import type {
  SaveResource,
  SaveResourceInput,
} from "#/modules/library/application/save-resource/save-resource";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import { resourceNotFoundError } from "#/modules/library/domain/errors/library-errors";
import type { LibraryPort } from "#/modules/library/domain/ports/library-port";
import { err, type Result } from "#/shared/domain/result";

export class SaveResourceUseCase implements SaveResource {
  constructor(
    private readonly library: LibraryPort,
    private readonly catalog: CatalogPort,
  ) {}

  async execute(input: SaveResourceInput): Promise<Result<SavedUserResource, LibraryError>> {
    const catalogResult = await this.catalog.getPublishedById(input.resourceId);
    if (!catalogResult.ok) {
      if (catalogResult.error.type === "not_found") {
        return err(resourceNotFoundError());
      }
      return err({
        type: "query_failed",
        message: catalogResult.error.message,
      });
    }

    return this.library.saveForUser({
      userId: input.userId,
      resourceId: input.resourceId,
    });
  }
}
