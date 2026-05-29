import { describe, expect, it } from "vite-plus/test";

import { parseCatalogFilters } from "#/modules/catalog/domain/entities/filters";

describe("parseCatalogFilters", () => {
  it("returns empty filters when input is missing", () => {
    expect(parseCatalogFilters()).toEqual({});
  });

  it("trims category and ignores invalid enum values", () => {
    expect(
      parseCatalogFilters({
        category: "  Networking  ",
        level: "expert" as never,
        resourceType: "podcast" as never,
      }),
    ).toEqual({ category: "Networking" });
  });

  it("accepts valid level and resource type filters", () => {
    expect(
      parseCatalogFilters({
        level: "beginner",
        resourceType: "lab",
      }),
    ).toEqual({
      level: "beginner",
      resourceType: "lab",
    });
  });

  it("ignores blank category values after trimming", () => {
    expect(parseCatalogFilters({ category: "   " })).toEqual({});
  });
});
