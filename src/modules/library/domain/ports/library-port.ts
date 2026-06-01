import type { PersonalLibraryItem } from "#/modules/library/domain/entities/personal-library-item";
import type {
  SavedUserResource,
  UserResourceStatus,
} from "#/modules/library/domain/entities/user-resource";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import type { Result } from "#/shared/domain/result";

export type UserResourceLookupInput = {
  userId: string;
  resourceId: string;
};

export type ListForUserInput = {
  userId: string;
  status?: UserResourceStatus;
};

export type UpdateForUserInput = UserResourceLookupInput & {
  status: UserResourceStatus;
  progressPercentage: number;
  startedAt: string | null;
  completedAt: string | null;
};

export interface LibraryPort {
  saveForUser(input: UserResourceLookupInput): Promise<Result<SavedUserResource, LibraryError>>;
  getForUser(
    input: UserResourceLookupInput,
  ): Promise<Result<SavedUserResource | null, LibraryError>>;
  updateForUser(input: UpdateForUserInput): Promise<Result<SavedUserResource, LibraryError>>;
  listForUser(input: ListForUserInput): Promise<Result<PersonalLibraryItem[], LibraryError>>;
}
