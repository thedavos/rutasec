import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import type { Result } from "#/shared/domain/result";

export type SaveResourceInput = {
  userId: string;
  resourceId: string;
};

export interface SaveResource {
  execute(input: SaveResourceInput): Promise<Result<SavedUserResource, LibraryError>>;
}
