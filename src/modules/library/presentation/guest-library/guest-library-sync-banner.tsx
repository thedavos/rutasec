import * as m from "#/paraglide/messages.js";
import {
  useGuestLibraryEntries,
  useRetryGuestLibrarySync,
} from "#/modules/library/presentation/guest-library/use-guest-library";
import { Button } from "#/shared/presentation/ui/button";

export function GuestLibrarySyncBanner() {
  const entriesQuery = useGuestLibraryEntries();
  const retrySync = useRetryGuestLibrarySync();
  const failedEntries = entriesQuery.data?.filter((entry) => entry.syncStatus === "failed") ?? [];

  if (failedEntries.length === 0) {
    return null;
  }

  const latestError = failedEntries[0]?.syncError ?? m.guest_library_sync_error_fallback();

  return (
    <div
      className="mb-6 rounded-xl border border-[var(--danger-border)] bg-[var(--danger-soft)] px-4 py-3"
      role="alert"
    >
      <p className="text-sm text-[var(--text-primary)]">{m.guest_library_sync_failed_title()}</p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">{latestError}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        disabled={retrySync.isPending}
        onClick={() => {
          void retrySync.mutateAsync();
        }}
      >
        {retrySync.isPending ? m.guest_library_sync_retrying() : m.guest_library_sync_retry()}
      </Button>
    </div>
  );
}
