// @vitest-environment jsdom

import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vite-plus/test";

import { isCatalogNavActive } from "#/modules/catalog/presentation/catalog-nav-active";
import { MainNavLink } from "#/shared/presentation/layout/main-nav-link";
import {
  expectNavLinkActive,
  expectNavLinkInactive,
  renderNavLink,
} from "#/shared/presentation/testing/render-nav-link";

beforeEach(() => {
  vi.stubGlobal("scrollTo", vi.fn());
});

afterEach(() => {
  cleanup();
});

function DashboardMainNavLink() {
  return <MainNavLink to="/dashboard" label="Dashboard" />;
}

function CatalogMainNavLink() {
  return <MainNavLink to="/" label="Catalog" isActive={isCatalogNavActive} />;
}

describe("MainNavLink", () => {
  describe("default activeProps", () => {
    it("marks dashboard active on the dashboard route", async () => {
      await renderNavLink("/dashboard", DashboardMainNavLink);

      expectNavLinkActive(screen.getByRole("link", { name: "Dashboard" }));
    });

    it("marks dashboard inactive on catalog", async () => {
      await renderNavLink("/", DashboardMainNavLink);

      expectNavLinkInactive(screen.getByRole("link", { name: "Dashboard" }));
    });
  });

  describe("custom isActive", () => {
    it("marks catalog active on resource detail routes", async () => {
      await renderNavLink("/resources/resource-1", CatalogMainNavLink);

      expectNavLinkActive(screen.getByRole("link", { name: "Catalog" }));
    });

    it("marks catalog inactive on dashboard", async () => {
      await renderNavLink("/dashboard", CatalogMainNavLink);

      expectNavLinkInactive(screen.getByRole("link", { name: "Catalog" }));
    });
  });
});
