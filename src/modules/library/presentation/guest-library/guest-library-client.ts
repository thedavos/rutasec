import { getGuestLibraryStore } from "#/modules/library/adapters/guest/indexeddb-guest-library-store";
import { SyncGuestLibraryUseCase } from "#/modules/library/application/sync-guest-library/sync-guest-library.use-case";
import type { GuestLibraryEntry } from "#/modules/library/domain/entities/guest-library-entry";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import { saveResourceFn } from "#/modules/library/server/save-resource";
import { err, ok, type Result } from "#/shared/domain/result";

export async function listGuestLibraryEntries(): Promise<GuestLibraryEntry[]> {
  return getGuestLibraryStore().list();
}

export async function saveGuestLibraryEntry(resourceId: string): Promise<GuestLibraryEntry> {
  return getGuestLibraryStore().save(resourceId);
}

export async function removeGuestLibraryEntry(resourceId: string): Promise<void> {
  await getGuestLibraryStore().remove([resourceId]);
}

async function saveResourceForSync(
  resourceId: string,
): Promise<Result<SavedUserResource, LibraryError>> {
  try {
    const saved = await saveResourceFn({ data: { resourceId } });
    return ok(saved);
  } catch (error) {
    return err({
      type: "query_failed",
      message: error instanceof Error ? error.message : "Could not sync guest library entry",
    });
  }
}

export async function syncGuestLibraryToServer() {
  const useCase = new SyncGuestLibraryUseCase(getGuestLibraryStore());
  return useCase.execute({
    saveResource: saveResourceForSync,
  });
}

export async function retryFailedGuestLibrarySync() {
  const store = getGuestLibraryStore();
  const failedEntries = (await store.list()).filter((entry) => entry.syncStatus === "failed");

  await Promise.all(
    failedEntries.map((entry) =>
      store.updateSyncStatus(entry.resourceId, {
        syncStatus: "pending",
        syncError: null,
      }),
    ),
  );

  return syncGuestLibraryToServer();
}
