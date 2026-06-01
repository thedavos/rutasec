import { applyUserResourceUpdate } from "#/modules/library/domain/entities/apply-user-resource-update";
import type {
  UpdateUserResource,
  UpdateUserResourceInput,
} from "#/modules/library/application/update-user-resource/update-user-resource";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import { userResourceNotFoundError } from "#/modules/library/domain/errors/library-errors";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import type { LibraryPort } from "#/modules/library/domain/ports/library-port";
import { err, type Result } from "#/shared/domain/result";

export class UpdateUserResourceUseCase implements UpdateUserResource {
  constructor(private readonly library: LibraryPort) {}

  async execute(input: UpdateUserResourceInput): Promise<Result<SavedUserResource, LibraryError>> {
    const existing = await this.library.getForUser({
      userId: input.userId,
      resourceId: input.resourceId,
    });

    if (!existing.ok) {
      return existing;
    }

    if (existing.value === null) {
      return err(userResourceNotFoundError());
    }

    const fields = applyUserResourceUpdate(
      existing.value,
      {
        status: input.status,
        progressPercentage: input.progressPercentage,
      },
      new Date().toISOString(),
    );

    return this.library.updateForUser({
      userId: input.userId,
      resourceId: input.resourceId,
      ...fields,
    });
  }
}
