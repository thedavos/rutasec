export const GUEST_LIBRARY_DB_NAME = "rutasec-guest-library";
export const GUEST_LIBRARY_STORE_NAME = "entries";
export const GUEST_LIBRARY_DB_VERSION = 1;

export type GuestLibraryDb = IDBDatabase;

export function openGuestLibraryDb(
  idb: IDBFactory = globalThis.indexedDB,
): Promise<GuestLibraryDb> {
  return new Promise((resolve, reject) => {
    const request = idb.open(GUEST_LIBRARY_DB_NAME, GUEST_LIBRARY_DB_VERSION);

    request.onerror = () => {
      reject(request.error ?? new Error("Failed to open guest library database"));
    };

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(GUEST_LIBRARY_STORE_NAME)) {
        database.createObjectStore(GUEST_LIBRARY_STORE_NAME, { keyPath: "resourceId" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}
