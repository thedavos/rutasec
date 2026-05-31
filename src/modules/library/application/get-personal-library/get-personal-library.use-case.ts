import type {
  GetPersonalLibrary,
  GetPersonalLibraryInput,
} from "#/modules/library/application/get-personal-library/get-personal-library";
import type { PersonalLibrary } from "#/modules/library/domain/entities/personal-library-item";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import type { LibraryPort } from "#/modules/library/domain/ports/library-port";
import { ok, type Result } from "#/shared/domain/result";

export class GetPersonalLibraryUseCase implements GetPersonalLibrary {
  constructor(private readonly library: LibraryPort) {}

  async execute(input: GetPersonalLibraryInput): Promise<Result<PersonalLibrary, LibraryError>> {
    const listResult = await this.library.listForUser({
      userId: input.userId,
      status: input.status,
    });

    if (!listResult.ok) {
      return listResult;
    }

    return ok({
      items: listResult.value,
      statusFilter: input.status ?? null,
    });
  }
}
