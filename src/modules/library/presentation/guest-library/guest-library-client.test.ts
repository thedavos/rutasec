import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

import type { GuestLibraryEntry } from "#/modules/library/domain/entities/guest-library-entry";
import type { GuestLibraryStore } from "#/modules/library/adapters/guest/guest-library-store";

function createTestGuestLibraryStore(): GuestLibraryStore {
  const entries = new Map<string, GuestLibraryEntry>();

  return {
    async list() {
      return [...entries.values()].sort((left, right) => right.savedAt.localeCompare(left.savedAt));
    },
    async save(resourceId) {
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
    async remove(resourceIds) {
      for (const resourceId of resourceIds) {
        entries.delete(resourceId);
      }
    },
    async updateSyncStatus(resourceId, update) {
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

const { memoryStore, getGuestLibraryStore } = vi.hoisted(() => {
  const store = createTestGuestLibraryStore();
  return {
    memoryStore: store,
    getGuestLibraryStore: vi.fn(() => store),
  };
});

vi.mock("#/modules/library/adapters/guest/indexeddb-guest-library-store", () => ({
  getGuestLibraryStore,
}));

vi.mock("#/modules/library/server/save-resource", () => ({
  saveResourceFn: vi.fn(),
}));

import { saveResourceFn } from "#/modules/library/server/save-resource";
import {
  listGuestLibraryEntries,
  removeGuestLibraryEntry,
  retryFailedGuestLibrarySync,
  saveGuestLibraryEntry,
  syncGuestLibraryToServer,
} from "#/modules/library/presentation/guest-library/guest-library-client";

const mockSaveResourceFn = vi.mocked(saveResourceFn);

describe("guest-library-client", () => {
  beforeEach(async () => {
    await memoryStore.remove((await memoryStore.list()).map((entry) => entry.resourceId));
    vi.clearAllMocks();
  });

  it("lists and saves guest entries through the store", async () => {
    const saved = await saveGuestLibraryEntry("res-1");
    const entries = await listGuestLibraryEntries();

    expect(saved.resourceId).toBe("res-1");
    expect(entries).toHaveLength(1);
  });

  it("removes a guest entry through the store", async () => {
    await saveGuestLibraryEntry("res-1");

    await removeGuestLibraryEntry("res-1");

    expect(await listGuestLibraryEntries()).toEqual([]);
  });

  it("syncs guest entries to the server and clears local rows", async () => {
    await memoryStore.save("res-1");
    mockSaveResourceFn.mockResolvedValue({
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
    });

    const result = await syncGuestLibraryToServer();

    expect(result.outcomes).toEqual([{ resourceId: "res-1", status: "synced", error: null }]);
    expect(await memoryStore.list()).toEqual([]);
  });

  it("maps Error sync failures to the thrown message", async () => {
    await memoryStore.save("res-1");
    mockSaveResourceFn.mockRejectedValue(new Error("Server unavailable"));

    const result = await syncGuestLibraryToServer();

    expect(result.outcomes[0]?.error).toBe("Server unavailable");
  });

  it("maps non-error sync failures to query_failed results", async () => {
    await memoryStore.save("res-1");
    mockSaveResourceFn.mockRejectedValue("offline");

    const result = await syncGuestLibraryToServer();

    expect(result.outcomes[0]?.status).toBe("failed");
    expect(result.outcomes[0]?.error).toBe("Could not sync guest library entry");
  });

  it("retries failed sync without deleting local entries on failure", async () => {
    await memoryStore.save("res-1");
    await memoryStore.updateSyncStatus("res-1", {
      syncStatus: "failed",
      syncError: "Network error",
    });
    mockSaveResourceFn.mockRejectedValue(new Error("Still failing"));

    const result = await retryFailedGuestLibrarySync();

    expect(result.outcomes[0]?.status).toBe("failed");
    expect(await memoryStore.list()).toHaveLength(1);
    expect((await memoryStore.list())[0]?.syncStatus).toBe("failed");
  });
});
