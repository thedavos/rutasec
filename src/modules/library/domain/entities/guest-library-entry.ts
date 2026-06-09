export const GUEST_LIBRARY_SYNC_STATUSES = ["pending", "synced", "failed"] as const;

export type GuestLibrarySyncStatus = (typeof GUEST_LIBRARY_SYNC_STATUSES)[number];

export type GuestLibraryEntry = {
  resourceId: string;
  savedAt: string;
  syncStatus: GuestLibrarySyncStatus;
  syncError: string | null;
};

export type GuestLibrary = {
  items: GuestLibraryEntry[];
};

export type GuestLibrarySyncOutcomeStatus = "synced" | "skipped_duplicate" | "failed";

export type GuestLibrarySyncOutcome = {
  resourceId: string;
  status: GuestLibrarySyncOutcomeStatus;
  error: string | null;
};

export type GuestLibrarySyncResult = {
  outcomes: GuestLibrarySyncOutcome[];
};
