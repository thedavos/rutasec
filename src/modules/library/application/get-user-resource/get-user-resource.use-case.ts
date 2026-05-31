import type {
  GetUserResource,
  GetUserResourceInput,
} from "#/modules/library/application/get-user-resource/get-user-resource";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import type { LibraryPort } from "#/modules/library/domain/ports/library-port";
import type { Result } from "#/shared/domain/result";

export class GetUserResourceUseCase implements GetUserResource {
  constructor(private readonly library: LibraryPort) {}

  execute(input: GetUserResourceInput): Promise<Result<SavedUserResource | null, LibraryError>> {
    return this.library.getForUser({
      userId: input.userId,
      resourceId: input.resourceId,
    });
  }
}
