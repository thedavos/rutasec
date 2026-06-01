import type {
  SavedUserResource,
  UserResourceStatus,
} from "#/modules/library/domain/entities/user-resource";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import type { Result } from "#/shared/domain/result";

export type UpdateUserResourceInput = {
  userId: string;
  resourceId: string;
  status: UserResourceStatus;
  progressPercentage: number;
};

export interface UpdateUserResource {
  execute(input: UpdateUserResourceInput): Promise<Result<SavedUserResource, LibraryError>>;
}
