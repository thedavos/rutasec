// @vitest-environment jsdom

import "fake-indexeddb/auto";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

vi.mock("#/modules/library/presentation/guest-library/guest-library-client", () => ({
  listGuestLibraryEntries: vi.fn(),
  saveGuestLibraryEntry: vi.fn(),
  syncGuestLibraryToServer: vi.fn(),
  retryFailedGuestLibrarySync: vi.fn(),
}));

import {
  listGuestLibraryEntries,
  retryFailedGuestLibrarySync,
  saveGuestLibraryEntry,
  syncGuestLibraryToServer,
} from "#/modules/library/presentation/guest-library/guest-library-client";
import {
  useGuestLibraryEntries,
  useGuestLibrarySave,
  useGuestLibrarySyncMutation,
  useIsGuestResourceSaved,
  useRetryGuestLibrarySync,
} from "#/modules/library/presentation/guest-library/use-guest-library";

const mockListGuestLibraryEntries = vi.mocked(listGuestLibraryEntries);
const mockSaveGuestLibraryEntry = vi.mocked(saveGuestLibraryEntry);
const mockSyncGuestLibraryToServer = vi.mocked(syncGuestLibraryToServer);
const mockRetryFailedGuestLibrarySync = vi.mocked(retryFailedGuestLibrarySync);

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useGuestLibrary hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads guest library entries", async () => {
    mockListGuestLibraryEntries.mockResolvedValue([
      {
        resourceId: "res-1",
        savedAt: "2026-06-08T12:00:00.000Z",
        syncStatus: "pending",
        syncError: null,
      },
    ]);

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { result } = renderHook(() => useGuestLibraryEntries(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.data?.length).toBe(1);
    });
  });

  it("ignores synced guest entries when checking saved state", async () => {
    mockListGuestLibraryEntries.mockResolvedValue([
      {
        resourceId: "res-1",
        savedAt: "2026-06-08T12:00:00.000Z",
        syncStatus: "synced",
        syncError: null,
      },
    ]);

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { result } = renderHook(() => useIsGuestResourceSaved("res-1"), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSaved).toBe(false);
  });

  it("reports when a guest resource is saved", async () => {
    mockListGuestLibraryEntries.mockResolvedValue([
      {
        resourceId: "res-1",
        savedAt: "2026-06-08T12:00:00.000Z",
        syncStatus: "pending",
        syncError: null,
      },
    ]);

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { result } = renderHook(() => useIsGuestResourceSaved("res-1"), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSaved).toBe(true);
    });
  });

  it("saves a guest resource through the mutation", async () => {
    mockSaveGuestLibraryEntry.mockResolvedValue({
      resourceId: "res-2",
      savedAt: "2026-06-08T12:00:00.000Z",
      syncStatus: "pending",
      syncError: null,
    });
    mockListGuestLibraryEntries.mockResolvedValue([]);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const { result } = renderHook(() => useGuestLibrarySave(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync("res-2");

    expect(mockSaveGuestLibraryEntry.mock.calls[0]?.[0]).toBe("res-2");
  });

  it("syncs guest library entries through the mutation", async () => {
    mockSyncGuestLibraryToServer.mockResolvedValue({ outcomes: [] });
    mockListGuestLibraryEntries.mockResolvedValue([]);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const { result } = renderHook(() => useGuestLibrarySyncMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync();

    expect(mockSyncGuestLibraryToServer).toHaveBeenCalledTimes(1);
  });

  it("retries failed guest sync through the mutation", async () => {
    mockRetryFailedGuestLibrarySync.mockResolvedValue({ outcomes: [] });
    mockListGuestLibraryEntries.mockResolvedValue([]);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const { result } = renderHook(() => useRetryGuestLibrarySync(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync();

    expect(mockRetryFailedGuestLibrarySync).toHaveBeenCalledTimes(1);
  });
});
