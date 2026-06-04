// @vitest-environment jsdom

import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { authClient } from "#/modules/identity";
import { MobileNavDrawer } from "#/shared/presentation/layout/mobile-nav-drawer";
import { renderNavLink } from "#/shared/presentation/testing/render-nav-link";

vi.mock("#/modules/identity", () => ({
  authClient: {
    useSession: vi.fn(),
  },
}));

const mockUseSession = vi.mocked(authClient.useSession);

beforeEach(() => {
  vi.stubGlobal("scrollTo", vi.fn());
});

afterEach(() => {
  cleanup();
});

function mockSignedOutSession() {
  mockUseSession.mockReturnValue({
    data: null,
    isPending: false,
    isRefetching: false,
    error: null,
  } as ReturnType<typeof authClient.useSession>);
}

function mockAuthenticatedSession() {
  mockUseSession.mockReturnValue({
    data: { user: { id: "user-1", name: "Test User", email: "test@example.com" } },
    isPending: false,
    isRefetching: false,
    error: null,
  } as ReturnType<typeof authClient.useSession>);
}

describe("MobileNavDrawer", () => {
  it("opens with public nav and sign-in actions when signed out", async () => {
    mockSignedOutSession();
    await renderNavLink("/", MobileNavDrawer);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Resources" })).toBeTruthy();
      expect(screen.getByRole("link", { name: "Sign in" })).toBeTruthy();
      expect(screen.getByRole("link", { name: "Sign up" })).toBeTruthy();
    });
    expect(screen.queryByRole("link", { name: "Dashboard" })).toBeNull();
  });

  it("opens with authenticated nav and sign out when signed in", async () => {
    mockAuthenticatedSession();
    await renderNavLink("/", MobileNavDrawer);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Dashboard" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Sign out" })).toBeTruthy();
    });
    expect(screen.queryByRole("link", { name: "Sign up" })).toBeNull();
  });
});
