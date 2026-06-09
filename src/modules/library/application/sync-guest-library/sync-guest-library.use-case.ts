import type {
  SyncGuestLibrary,
  SyncGuestLibraryInput,
} from "#/modules/library/application/sync-guest-library/sync-guest-library";
import type { GuestLibraryStore } from "#/modules/library/adapters/guest/guest-library-store";
import type { GuestLibrarySyncResult } from "#/modules/library/domain/entities/guest-library-entry";
import { libraryErrorMessage } from "#/modules/library/domain/errors/library-errors";

export class SyncGuestLibraryUseCase implements SyncGuestLibrary {
  constructor(private readonly guestStore: GuestLibraryStore) {}

  async execute(input: SyncGuestLibraryInput): Promise<GuestLibrarySyncResult> {
    const entries = await this.guestStore.list();
    const toSync = entries.filter(
      (entry) => entry.syncStatus === "pending" || entry.syncStatus === "failed",
    );

    const outcomes: GuestLibrarySyncResult["outcomes"] = [];

    for (const entry of toSync) {
      const result = await input.saveResource(entry.resourceId);

      if (result.ok) {
        await this.guestStore.remove([entry.resourceId]);
        outcomes.push({
          resourceId: entry.resourceId,
          status: "synced",
          error: null,
        });
        continue;
      }

      const errorMessage = libraryErrorMessage(result.error);
      await this.guestStore.updateSyncStatus(entry.resourceId, {
        syncStatus: "failed",
        syncError: errorMessage,
      });
      outcomes.push({
        resourceId: entry.resourceId,
        status: "failed",
        error: errorMessage,
      });
    }

    return { outcomes };
  }
}
