import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import type { Result } from "#/shared/domain/result";

export type SaveForUserInput = {
  userId: string;
  resourceId: string;
};

export interface LibraryPort {
  saveForUser(input: SaveForUserInput): Promise<Result<SavedUserResource, LibraryError>>;
}
