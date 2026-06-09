import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import type { GuestLibrarySyncResult } from "#/modules/library/domain/entities/guest-library-entry";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import type { Result } from "#/shared/domain/result";

export type SyncGuestLibraryInput = {
  saveResource: (resourceId: string) => Promise<Result<SavedUserResource, LibraryError>>;
};

export interface SyncGuestLibrary {
  execute(input: SyncGuestLibraryInput): Promise<GuestLibrarySyncResult>;
}
