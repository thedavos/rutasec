// @vitest-environment jsdom

import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { authClient } from "#/modules/identity";
import { PublicNavGroup } from "#/shared/presentation/layout/public-nav-group";
import { RUTASEC_GITHUB_URL } from "#/shared/presentation/layout/public-nav.constants";
import {
  expectNavLinkInactive,
  renderNavLink,
} from "#/shared/presentation/testing/render-nav-link";

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

describe("PublicNavGroup", () => {
  it("renders Resources, GitHub, and Send Resource links when signed out", async () => {
    mockSignedOutSession();
    await renderNavLink("/", PublicNavGroup);

    expect(screen.getByRole("link", { name: "Resources" })).toBeTruthy();
    const githubLink = screen.getByRole("link", { name: "GitHub" });
    expect(githubLink.getAttribute("href")).toBe(RUTASEC_GITHUB_URL);
    expect(githubLink.getAttribute("target")).toBe("_blank");
    expect(githubLink.getAttribute("rel")).toBe("noopener noreferrer");
    expect(screen.getByRole("link", { name: "Send Resource" })).toBeTruthy();
  });

  it("renders nothing when authenticated", async () => {
    mockAuthenticatedSession();
    await renderNavLink("/", PublicNavGroup);

    expect(screen.queryByRole("link", { name: "Resources" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Send Resource" })).toBeNull();
  });

  it("hides the Send Resource link on the send-resource route", async () => {
    mockSignedOutSession();
    await renderNavLink("/send-resource", PublicNavGroup);

    expect(screen.queryByRole("link", { name: "Send Resource" })).toBeNull();
    expect(screen.getByRole("link", { name: "Resources" })).toBeTruthy();
  });

  it("marks Send Resource inactive on catalog", async () => {
    mockSignedOutSession();
    await renderNavLink("/", PublicNavGroup);

    expectNavLinkInactive(screen.getByRole("link", { name: "Send Resource" }));
  });
});
