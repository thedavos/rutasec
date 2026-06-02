import { describe, expect, it } from "vite-plus/test";

import { isCatalogNavActive } from "#/modules/catalog/presentation/catalog-nav-active";

describe("isCatalogNavActive", () => {
  it("returns true on the catalog index", () => {
    expect(isCatalogNavActive("/")).toBe(true);
  });

  it("returns true on resource detail routes", () => {
    expect(isCatalogNavActive("/resources/abc-123")).toBe(true);
  });

  it("returns false on authenticated app routes", () => {
    expect(isCatalogNavActive("/dashboard")).toBe(false);
    expect(isCatalogNavActive("/library")).toBe(false);
    expect(isCatalogNavActive("/goals")).toBe(false);
    expect(isCatalogNavActive("/goals/goal-1/timeline")).toBe(false);
  });

  it("returns false on auth routes", () => {
    expect(isCatalogNavActive("/sign-in")).toBe(false);
    expect(isCatalogNavActive("/sign-up")).toBe(false);
  });
});
