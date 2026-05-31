import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import type { Result } from "#/shared/domain/result";

export type GetUserResourceInput = {
  userId: string;
  resourceId: string;
};

export interface GetUserResource {
  execute(input: GetUserResourceInput): Promise<Result<SavedUserResource | null, LibraryError>>;
}
