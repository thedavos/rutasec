// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { authClient } from "#/modules/identity";
import { SaveToLibraryCta } from "#/modules/library/presentation/save-to-library-cta";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: { children: React.ReactNode; to: string }) => (
    <a href={props.to}>{children}</a>
  ),
}));

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
  useGuestLibraryRemove: vi.fn(),
  useIsGuestResourceSaved: vi.fn(),
}));

import {
  useGuestLibraryRemove,
  useGuestLibrarySave,
  useIsGuestResourceSaved,
} from "#/modules/library/presentation/guest-library/use-guest-library";

const mockUseSession = vi.mocked(authClient.useSession);
const mockUseGuestLibrarySave = vi.mocked(useGuestLibrarySave);
const mockUseGuestLibraryRemove = vi.mocked(useGuestLibraryRemove);
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
  mockUseGuestLibraryRemove.mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useGuestLibraryRemove>);
  mockUseIsGuestResourceSaved.mockReturnValue({
    isSaved: false,
    isPending: false,
  });
});

afterEach(() => {
  cleanup();
});

describe("SaveToLibraryCta", () => {
  it("shows remove when a guest resource is already saved on this device", () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
      isRefetching: false,
      error: null,
    } as ReturnType<typeof authClient.useSession>);
    mockUseIsGuestResourceSaved.mockReturnValue({
      isSaved: true,
      isPending: false,
    });

    renderWithQuery(<SaveToLibraryCta resourceId="res-1" signInRedirect="/resources/res-1" />);

    expect(screen.getByRole("button", { name: "Remove from this device" })).toBeTruthy();
  });

  it("lets guests remove a locally saved resource", async () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
      isRefetching: false,
      error: null,
    } as ReturnType<typeof authClient.useSession>);
    mockUseIsGuestResourceSaved.mockReturnValue({
      isSaved: true,
      isPending: false,
    });
    const removeAsync = vi.fn().mockResolvedValue(undefined);
    mockUseGuestLibraryRemove.mockReturnValue({
      mutateAsync: removeAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useGuestLibraryRemove>);

    renderWithQuery(
      <SaveToLibraryCta resourceId="res-1" signInRedirect="/resources/res-1" initialIsSaved />,
    );

    expect(screen.getByRole("button", { name: "Remove from this device" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Remove from this device" }));

    await waitFor(() => {
      expect(removeAsync).toHaveBeenCalledWith("res-1");
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Save to library" })).toBeTruthy();
    });
  });

  it("does not show remove for authenticated users", () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "user-1", name: "Test", email: "test@example.com" } },
      isPending: false,
      isRefetching: false,
      error: null,
    } as ReturnType<typeof authClient.useSession>);

    renderWithQuery(
      <SaveToLibraryCta resourceId="res-1" signInRedirect="/resources/res-1" initialIsSaved />,
    );

    expect(screen.queryByRole("button", { name: "Remove from this device" })).toBeNull();
    expect(screen.getByRole("button", { name: "Saved to library" }).hasAttribute("disabled")).toBe(
      true,
    );
  });
});
