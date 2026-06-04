// @vitest-environment jsdom

import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { authClient } from "#/modules/identity";
import { AuthenticatedNavGroup } from "#/shared/presentation/layout/authenticated-nav-group";
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

function mockAuthenticatedSession() {
  mockUseSession.mockReturnValue({
    data: { user: { id: "user-1", name: "Test User", email: "test@example.com" } },
    isPending: false,
    isRefetching: false,
    error: null,
  } as ReturnType<typeof authClient.useSession>);
}

function mockSignedOutSession() {
  mockUseSession.mockReturnValue({
    data: null,
    isPending: false,
    isRefetching: false,
    error: null,
  } as ReturnType<typeof authClient.useSession>);
}

function mockPendingSession() {
  mockUseSession.mockReturnValue({
    data: null,
    isPending: true,
    isRefetching: false,
    error: null,
  } as ReturnType<typeof authClient.useSession>);
}

describe("AuthenticatedNavGroup", () => {
  it("renders nothing when signed out", async () => {
    mockSignedOutSession();
    await renderNavLink("/", AuthenticatedNavGroup);

    expect(screen.queryByRole("link", { name: "Catalog" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Dashboard" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Library" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Goals" })).toBeNull();
  });

  it("renders nothing while session is pending", async () => {
    mockPendingSession();
    await renderNavLink("/", AuthenticatedNavGroup);

    expect(screen.queryByRole("link", { name: "Catalog" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Dashboard" })).toBeNull();
  });

  it("renders all authenticated nav links when signed in", async () => {
    mockAuthenticatedSession();
    await renderNavLink("/", AuthenticatedNavGroup);

    expect(screen.getByRole("link", { name: "Catalog" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Library" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Goals" })).toBeTruthy();
  });
});
