import type { PersonalLibrary } from "#/modules/library/domain/entities/personal-library-item";
import type { UserResourceStatus } from "#/modules/library/domain/entities/user-resource";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import type { Result } from "#/shared/domain/result";

export type GetPersonalLibraryInput = {
  userId: string;
  status?: UserResourceStatus;
};

export interface GetPersonalLibrary {
  execute(input: GetPersonalLibraryInput): Promise<Result<PersonalLibrary, LibraryError>>;
}
