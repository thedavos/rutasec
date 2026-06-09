import type {
  GuestLibraryStore,
  UpdateGuestLibrarySyncStatusInput,
} from "#/modules/library/adapters/guest/guest-library-store";
import {
  openGuestLibraryDb,
  GUEST_LIBRARY_STORE_NAME,
} from "#/modules/library/adapters/guest/guest-library-db";
import { guestLibraryEntrySchema } from "#/modules/library/adapters/schemas/guest-library-entry.schema";
import type { GuestLibraryEntry } from "#/modules/library/domain/entities/guest-library-entry";

function parseEntry(value: unknown): GuestLibraryEntry | null {
  const parsed = guestLibraryEntrySchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function runTransaction<T>(
  database: IDBDatabase,
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(GUEST_LIBRARY_STORE_NAME, mode);
    const store = transaction.objectStore(GUEST_LIBRARY_STORE_NAME);
    const request = run(store);

    let result: T | undefined;

    request.onerror = () => {
      reject(request.error ?? new Error("Guest library IndexedDB request failed"));
    };

    transaction.onerror = () => {
      reject(transaction.error ?? new Error("Guest library IndexedDB transaction failed"));
    };

    request.onsuccess = () => {
      result = request.result as T;
    };

    transaction.oncomplete = () => {
      resolve(result as T);
    };
  });
}

export function createIndexedDbGuestLibraryStore(
  openDb: () => Promise<IDBDatabase> = openGuestLibraryDb,
): GuestLibraryStore {
  return {
    async list(): Promise<GuestLibraryEntry[]> {
      const database = await openDb();
      const rows = await runTransaction(database, "readonly", (store) => store.getAll());

      return rows
        .map((row) => parseEntry(row))
        .filter((entry): entry is GuestLibraryEntry => entry !== null)
        .sort((left, right) => right.savedAt.localeCompare(left.savedAt));
    },

    async save(resourceId: string): Promise<GuestLibraryEntry> {
      const database = await openDb();
      const existing = parseEntry(
        await runTransaction(database, "readonly", (store) => store.get(resourceId)),
      );

      if (existing) {
        return existing;
      }

      const entry: GuestLibraryEntry = {
        resourceId,
        savedAt: new Date().toISOString(),
        syncStatus: "pending",
        syncError: null,
      };

      await runTransaction(database, "readwrite", (store) => store.put(entry));
      return entry;
    },

    async remove(resourceIds: string[]): Promise<void> {
      if (resourceIds.length === 0) {
        return;
      }

      const database = await openDb();
      await Promise.all(
        resourceIds.map((resourceId) =>
          runTransaction(database, "readwrite", (store) => store.delete(resourceId)),
        ),
      );
    },

    async updateSyncStatus(
      resourceId: string,
      update: UpdateGuestLibrarySyncStatusInput,
    ): Promise<GuestLibraryEntry | null> {
      const database = await openDb();
      const existing = parseEntry(
        await runTransaction(database, "readonly", (store) => store.get(resourceId)),
      );

      if (!existing) {
        return null;
      }

      const nextEntry: GuestLibraryEntry = {
        ...existing,
        syncStatus: update.syncStatus,
        syncError: update.syncError,
      };

      await runTransaction(database, "readwrite", (store) => store.put(nextEntry));
      return nextEntry;
    },
  };
}

let defaultStore: GuestLibraryStore | null = null;

export function getGuestLibraryStore(): GuestLibraryStore {
  if (typeof indexedDB === "undefined") {
    throw new Error("Guest library storage is only available in the browser");
  }

  defaultStore ??= createIndexedDbGuestLibraryStore();
  return defaultStore;
}
