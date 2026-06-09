import { describe, expect, it } from "vite-plus/test";

import { createMemoryGuestLibraryStore } from "#/modules/library/adapters/guest/memory-guest-library-store";

describe("createMemoryGuestLibraryStore", () => {
  it("saves a resource idempotently", async () => {
    const store = createMemoryGuestLibraryStore();

    const first = await store.save("res-1");
    const second = await store.save("res-1");

    expect(second).toEqual(first);
    expect(await store.list()).toHaveLength(1);
  });

  it("updates sync status without deleting the entry", async () => {
    const store = createMemoryGuestLibraryStore();
    await store.save("res-1");

    const updated = await store.updateSyncStatus("res-1", {
      syncStatus: "failed",
      syncError: "Sync failed",
    });

    expect(updated?.syncStatus).toBe("failed");
    expect(updated?.syncError).toBe("Sync failed");
    expect(await store.list()).toHaveLength(1);
  });

  it("returns null when updating a missing entry", async () => {
    const store = createMemoryGuestLibraryStore();

    const updated = await store.updateSyncStatus("missing", {
      syncStatus: "failed",
      syncError: "Missing",
    });

    expect(updated).toBeNull();
  });

  it("removes synced entries", async () => {
    const store = createMemoryGuestLibraryStore();
    await store.save("res-1");

    await store.remove(["res-1"]);

    expect(await store.list()).toEqual([]);
  });
});
