// @vitest-environment jsdom

import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { CatalogNavLink } from "#/modules/catalog/presentation/catalog-nav-link";
import { DashboardNavLink } from "#/modules/dashboard/presentation/dashboard-nav-link";
import { GoalsNavLink } from "#/modules/goals/presentation/goals-nav-link";
import { LibraryNavLink } from "#/modules/identity/presentation/library-nav-link";
import { authClient } from "#/modules/identity";
import {
  expectNavLinkActive,
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

describe("CatalogNavLink", () => {
  it("marks catalog active on the index route", async () => {
    await renderNavLink("/", CatalogNavLink);

    expectNavLinkActive(screen.getByRole("link", { name: "Catalog" }));
  });

  it("marks catalog active on resource detail routes", async () => {
    await renderNavLink("/resources/resource-1", CatalogNavLink);

    expectNavLinkActive(screen.getByRole("link", { name: "Catalog" }));
  });

  it("marks catalog inactive on dashboard", async () => {
    await renderNavLink("/dashboard", CatalogNavLink);

    expectNavLinkInactive(screen.getByRole("link", { name: "Catalog" }));
  });
});

describe("DashboardNavLink", () => {
  beforeEach(() => {
    mockAuthenticatedSession();
  });

  it("renders nothing when signed out", async () => {
    mockSignedOutSession();
    await renderNavLink("/dashboard", DashboardNavLink);

    expect(screen.queryByRole("link", { name: "Dashboard" })).toBeNull();
  });

  it("marks dashboard active on the dashboard route", async () => {
    await renderNavLink("/dashboard", DashboardNavLink);

    expectNavLinkActive(screen.getByRole("link", { name: "Dashboard" }));
  });

  it("marks dashboard inactive on catalog", async () => {
    await renderNavLink("/", DashboardNavLink);

    expectNavLinkInactive(screen.getByRole("link", { name: "Dashboard" }));
  });
});

describe("LibraryNavLink", () => {
  beforeEach(() => {
    mockAuthenticatedSession();
  });

  it("marks library active on the library route", async () => {
    await renderNavLink("/library", LibraryNavLink);

    expectNavLinkActive(screen.getByRole("link", { name: "Library" }));
  });

  it("marks library inactive on catalog", async () => {
    await renderNavLink("/", LibraryNavLink);

    expectNavLinkInactive(screen.getByRole("link", { name: "Library" }));
  });
});

describe("GoalsNavLink", () => {
  beforeEach(() => {
    mockAuthenticatedSession();
  });

  it("marks goals active on the goals index", async () => {
    await renderNavLink("/goals", GoalsNavLink);

    expectNavLinkActive(screen.getByRole("link", { name: "Goals" }));
  });

  it("marks goals active on goal timeline subroutes", async () => {
    await renderNavLink("/goals/goal-1/timeline", GoalsNavLink);

    expectNavLinkActive(screen.getByRole("link", { name: "Goals" }));
  });

  it("marks goals inactive on catalog", async () => {
    await renderNavLink("/", GoalsNavLink);

    expectNavLinkInactive(screen.getByRole("link", { name: "Goals" }));
  });
});
