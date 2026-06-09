import type {
  GuestLibraryEntry,
  GuestLibrarySyncStatus,
} from "#/modules/library/domain/entities/guest-library-entry";

export type UpdateGuestLibrarySyncStatusInput = {
  syncStatus: GuestLibrarySyncStatus;
  syncError: string | null;
};

export interface GuestLibraryStore {
  list(): Promise<GuestLibraryEntry[]>;
  save(resourceId: string): Promise<GuestLibraryEntry>;
  remove(resourceIds: string[]): Promise<void>;
  updateSyncStatus(
    resourceId: string,
    update: UpdateGuestLibrarySyncStatusInput,
  ): Promise<GuestLibraryEntry | null>;
}
