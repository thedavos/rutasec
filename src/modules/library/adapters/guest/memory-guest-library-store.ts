import type {
  GuestLibraryStore,
  UpdateGuestLibrarySyncStatusInput,
} from "#/modules/library/adapters/guest/guest-library-store";
import type { GuestLibraryEntry } from "#/modules/library/domain/entities/guest-library-entry";

export function createMemoryGuestLibraryStore(
  initialEntries: GuestLibraryEntry[] = [],
): GuestLibraryStore {
  const entries = new Map(initialEntries.map((entry) => [entry.resourceId, entry]));

  return {
    async list(): Promise<GuestLibraryEntry[]> {
      return [...entries.values()].sort((left, right) => right.savedAt.localeCompare(left.savedAt));
    },

    async save(resourceId: string): Promise<GuestLibraryEntry> {
      const existing = entries.get(resourceId);
      if (existing) {
        return existing;
      }

      const entry: GuestLibraryEntry = {
        resourceId,
        savedAt: new Date().toISOString(),
        syncStatus: "pending",
        syncError: null,
      };
      entries.set(resourceId, entry);
      return entry;
    },

    async remove(resourceIds: string[]): Promise<void> {
      for (const resourceId of resourceIds) {
        entries.delete(resourceId);
      }
    },

    async updateSyncStatus(
      resourceId: string,
      update: UpdateGuestLibrarySyncStatusInput,
    ): Promise<GuestLibraryEntry | null> {
      const existing = entries.get(resourceId);
      if (!existing) {
        return null;
      }

      const nextEntry: GuestLibraryEntry = {
        ...existing,
        syncStatus: update.syncStatus,
        syncError: update.syncError,
      };
      entries.set(resourceId, nextEntry);
      return nextEntry;
    },
  };
}
