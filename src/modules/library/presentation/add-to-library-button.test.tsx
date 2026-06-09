// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { authClient } from "#/modules/identity";
import { saveResourceFn } from "#/modules/library";
import { AddToLibraryButton } from "#/modules/library/presentation/add-to-library-button";

vi.mock("#/modules/identity", () => ({
  authClient: {
    useSession: vi.fn(),
  },
}));

vi.mock("#/modules/library", () => ({
  saveResourceFn: vi.fn(),
}));

vi.mock("#/modules/library/presentation/guest-library/use-guest-library", () => ({
  useGuestLibrarySave: vi.fn(),
  useIsGuestResourceSaved: vi.fn(),
}));

import {
  useGuestLibrarySave,
  useIsGuestResourceSaved,
} from "#/modules/library/presentation/guest-library/use-guest-library";

const mockUseSession = vi.mocked(authClient.useSession);
const mockSaveResourceFn = vi.mocked(saveResourceFn);
const mockUseGuestLibrarySave = vi.mocked(useGuestLibrarySave);
const mockUseIsGuestResourceSaved = vi.mocked(useIsGuestResourceSaved);

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  vi.stubGlobal("scrollTo", vi.fn());
  mockUseGuestLibrarySave.mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useGuestLibrarySave>);
  mockUseIsGuestResourceSaved.mockReturnValue({
    isSaved: false,
    isPending: false,
  });
});

afterEach(() => {
  cleanup();
});

describe("AddToLibraryButton", () => {
  it("renders for signed-out visitors", () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
      isRefetching: false,
      error: null,
    } as ReturnType<typeof authClient.useSession>);

    renderWithQuery(<AddToLibraryButton resourceId="res-1" />);

    expect(screen.getByRole("button", { name: "Add to library" })).toBeTruthy();
  });

  it("saves the resource when signed in", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "user-1", name: "Test", email: "test@example.com" } },
      isPending: false,
      isRefetching: false,
      error: null,
    } as ReturnType<typeof authClient.useSession>);
    mockSaveResourceFn.mockResolvedValue({
      id: "ur-1",
      userId: "user-1",
      resourceId: "res-1",
      status: "pending",
      progressPercentage: 0,
      notes: null,
      startedAt: null,
      completedAt: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    renderWithQuery(<AddToLibraryButton resourceId="res-1" />);

    fireEvent.click(screen.getByRole("button", { name: "Add to library" }));
    await waitFor(() => {
      expect(mockSaveResourceFn).toHaveBeenCalledWith({ data: { resourceId: "res-1" } });
    });

    const savedButton = screen.getByRole("button", { name: "In library" });
    expect(savedButton.hasAttribute("disabled")).toBe(true);
  });
});
