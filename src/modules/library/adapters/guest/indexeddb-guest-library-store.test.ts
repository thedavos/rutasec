import "fake-indexeddb/auto";

import { describe, expect, it } from "vite-plus/test";

import {
  createIndexedDbGuestLibraryStore,
  getGuestLibraryStore,
} from "#/modules/library/adapters/guest/indexeddb-guest-library-store";
import {
  GUEST_LIBRARY_STORE_NAME,
  openGuestLibraryDb,
} from "#/modules/library/adapters/guest/guest-library-db";

describe("createIndexedDbGuestLibraryStore", () => {
  it("persists guest saves across store instances", async () => {
    const firstStore = createIndexedDbGuestLibraryStore();
    await firstStore.save("res-persist-1");

    const secondStore = createIndexedDbGuestLibraryStore();
    const entries = await secondStore.list();

    expect(entries.some((entry) => entry.resourceId === "res-persist-1")).toBe(true);
    expect(entries.find((entry) => entry.resourceId === "res-persist-1")?.syncStatus).toBe(
      "pending",
    );
  });

  it("updates sync failures without deleting the entry", async () => {
    const store = createIndexedDbGuestLibraryStore();
    await store.save("res-failed-1");

    const updated = await store.updateSyncStatus("res-failed-1", {
      syncStatus: "failed",
      syncError: "Sync failed",
    });

    expect(updated?.syncStatus).toBe("failed");
    expect(updated?.syncError).toBe("Sync failed");
    expect((await store.list()).some((entry) => entry.resourceId === "res-failed-1")).toBe(true);
  });

  it("removes entries after successful sync", async () => {
    const store = createIndexedDbGuestLibraryStore();
    await store.save("res-remove-1");

    await store.remove(["res-remove-1"]);

    expect((await store.list()).some((entry) => entry.resourceId === "res-remove-1")).toBe(false);
  });

  it("returns the existing entry when saving twice", async () => {
    const store = createIndexedDbGuestLibraryStore();
    const first = await store.save("res-duplicate-1");
    const second = await store.save("res-duplicate-1");

    expect(second).toEqual(first);
    expect(
      (await store.list()).filter((entry) => entry.resourceId === "res-duplicate-1"),
    ).toHaveLength(1);
  });

  it("ignores invalid persisted rows when listing", async () => {
    const database = await openGuestLibraryDb();
    const transaction = database.transaction(GUEST_LIBRARY_STORE_NAME, "readwrite");
    transaction.objectStore(GUEST_LIBRARY_STORE_NAME).put({ resourceId: "broken" });
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();

    const store = createIndexedDbGuestLibraryStore();
    const entries = await store.list();

    expect(entries.some((entry) => entry.resourceId === "broken")).toBe(false);
  });

  it("returns null when updating sync status for a missing entry", async () => {
    const store = createIndexedDbGuestLibraryStore();

    const updated = await store.updateSyncStatus("missing-entry", {
      syncStatus: "failed",
      syncError: "Missing",
    });

    expect(updated).toBeNull();
  });

  it("no-ops remove when given an empty list", async () => {
    const store = createIndexedDbGuestLibraryStore();
    await store.save("res-remove-empty-1");

    await store.remove([]);

    expect((await store.list()).some((entry) => entry.resourceId === "res-remove-empty-1")).toBe(
      true,
    );
  });

  it("reuses the default guest library store instance", () => {
    const first = getGuestLibraryStore();
    const second = getGuestLibraryStore();

    expect(first).toBe(second);
  });

  it("throws when IndexedDB is unavailable", () => {
    const originalIndexedDb = globalThis.indexedDB;
    Object.defineProperty(globalThis, "indexedDB", {
      configurable: true,
      value: undefined,
    });

    expect(() => getGuestLibraryStore()).toThrow(
      "Guest library storage is only available in the browser",
    );

    Object.defineProperty(globalThis, "indexedDB", {
      configurable: true,
      value: originalIndexedDb,
    });
  });
});
