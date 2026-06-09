import { describe, expect, it, vi } from "vite-plus/test";

import { createMemoryGuestLibraryStore } from "#/modules/library/adapters/guest/memory-guest-library-store";
import { SyncGuestLibraryUseCase } from "#/modules/library/application/sync-guest-library/sync-guest-library.use-case";
import type { GuestLibraryEntry } from "#/modules/library/domain/entities/guest-library-entry";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import { err, ok } from "#/shared/domain/result";

const savedResource: SavedUserResource = {
  id: "ur-1",
  userId: "user-1",
  resourceId: "res-1",
  status: "pending",
  progressPercentage: 0,
  notes: null,
  startedAt: null,
  completedAt: null,
  createdAt: "2026-06-08T12:00:00.000Z",
  updatedAt: "2026-06-08T12:00:00.000Z",
};

function createEntry(overrides: Partial<GuestLibraryEntry> = {}): GuestLibraryEntry {
  return {
    resourceId: "res-1",
    savedAt: "2026-06-08T12:00:00.000Z",
    syncStatus: "pending",
    syncError: null,
    ...overrides,
  };
}

describe("SyncGuestLibraryUseCase", () => {
  it("syncs pending guest entries and removes them after success", async () => {
    const guestStore = createMemoryGuestLibraryStore([createEntry()]);
    const saveResource = vi.fn().mockResolvedValue(ok(savedResource));
    const useCase = new SyncGuestLibraryUseCase(guestStore);

    const result = await useCase.execute({ saveResource });

    expect(result.outcomes).toEqual([{ resourceId: "res-1", status: "synced", error: null }]);
    expect(saveResource).toHaveBeenCalledWith("res-1");
    expect(await guestStore.list()).toEqual([]);
  });

  it("skips already-synced entries", async () => {
    const guestStore = createMemoryGuestLibraryStore([createEntry({ syncStatus: "synced" })]);
    const saveResource = vi.fn();
    const useCase = new SyncGuestLibraryUseCase(guestStore);

    const result = await useCase.execute({ saveResource });

    expect(result.outcomes).toEqual([]);
    expect(saveResource).not.toHaveBeenCalled();
  });

  it("retries failed entries and preserves local data when sync fails", async () => {
    const guestStore = createMemoryGuestLibraryStore([
      createEntry({ syncStatus: "failed", syncError: "Previous failure" }),
    ]);
    const saveResource = vi
      .fn()
      .mockResolvedValue(err({ type: "query_failed", message: "Network error" }));
    const useCase = new SyncGuestLibraryUseCase(guestStore);

    const result = await useCase.execute({ saveResource });

    expect(result.outcomes).toEqual([
      { resourceId: "res-1", status: "failed", error: "Network error" },
    ]);

    const entries = await guestStore.list();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.syncStatus).toBe("failed");
    expect(entries[0]?.syncError).toBe("Network error");
  });

  it("avoids duplicate rows by treating successful saves as synced", async () => {
    const guestStore = createMemoryGuestLibraryStore([
      createEntry({ resourceId: "res-1" }),
      createEntry({ resourceId: "res-2", savedAt: "2026-06-08T11:00:00.000Z" }),
    ]);
    const saveResource = vi.fn(async (resourceId: string) => ok({ ...savedResource, resourceId }));
    const useCase = new SyncGuestLibraryUseCase(guestStore);

    const result = await useCase.execute({ saveResource });

    expect(result.outcomes).toHaveLength(2);
    expect(result.outcomes.every((outcome) => outcome.status === "synced")).toBe(true);
    expect(saveResource).toHaveBeenCalledTimes(2);
    expect(await guestStore.list()).toEqual([]);
  });
});
