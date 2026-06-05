// @vitest-environment jsdom

import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import type { CatalogFilterOptions } from "#/modules/catalog/domain/entities/resource";
import { CatalogFiltersBar } from "#/modules/catalog/presentation/components/catalog-filters";
import { renderNavLink } from "#/shared/presentation/testing/render-nav-link";

beforeEach(() => {
  vi.stubGlobal("scrollTo", vi.fn());
});

afterEach(() => {
  cleanup();
});

const filterOptions: CatalogFilterOptions = {
  categories: ["Web Application Security"],
  levels: ["beginner", "intermediate"],
  resourceTypes: ["course", "lab"],
};

describe("CatalogFiltersBar sticky layout", () => {
  it("pins discovery controls as one sticky block", async () => {
    await renderNavLink("/", () => (
      <CatalogFiltersBar filters={{}} filterOptions={filterOptions} resultLabel="2 resources" />
    ));

    const filters = screen.getByRole("region", { name: "Catalog filters" });

    expect(filters.className).toContain("sticky");
    expect(filters.className).toContain("top-0");
    expect(filters.className).toContain("border-b");
    expect(filters.className).toContain("backdrop-blur-md");
  });
});

describe("CatalogFiltersBar mobile sheets", () => {
  it("opens the Type sheet and applies a selected option", async () => {
    const { router } = await renderNavLink("/", () => (
      <CatalogFiltersBar filters={{}} filterOptions={filterOptions} resultLabel="2 resources" />
    ));

    fireEvent.click(screen.getByRole("button", { name: "Filter by type" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Type" })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "Course" }));

    await waitFor(() => {
      expect(router.state.location.search).toEqual({ resourceType: "course" });
    });
  });

  it("clears Type via All in the mobile sheet", async () => {
    const { router } = await renderNavLink("/", () => (
      <CatalogFiltersBar
        filters={{ resourceType: "course" }}
        filterOptions={filterOptions}
        resultLabel="1 resource"
      />
    ));

    fireEvent.click(screen.getByRole("button", { name: "Type: Course" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "All" })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "All" }));

    await waitFor(() => {
      expect(router.state.location.search).toEqual({});
    });
  });
});
