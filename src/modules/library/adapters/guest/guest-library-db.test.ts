import "fake-indexeddb/auto";

import { describe, expect, it } from "vite-plus/test";

import { openGuestLibraryDb } from "#/modules/library/adapters/guest/guest-library-db";

describe("openGuestLibraryDb", () => {
  it("opens the guest library database", async () => {
    const database = await openGuestLibraryDb();
    expect(database.objectStoreNames.contains("entries")).toBe(true);
    database.close();
  });

  it("rejects when opening the database fails", async () => {
    const failingFactory = {
      open: () => {
        const request = {
          onerror: null as (() => void) | null,
          onsuccess: null,
          onupgradeneeded: null,
          error: new Error("open failed"),
          result: null,
        };

        queueMicrotask(() => {
          request.onerror?.();
        });

        return request as unknown as IDBOpenDBRequest;
      },
    } as unknown as IDBFactory;

    await expect(openGuestLibraryDb(failingFactory)).rejects.toThrow("open failed");
  });
});
