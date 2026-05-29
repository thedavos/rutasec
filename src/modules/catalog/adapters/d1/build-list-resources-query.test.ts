import { describe, expect, it } from "vite-plus/test";

import { buildListResourcesQuery } from "#/modules/catalog/adapters/d1/build-list-resources-query";

describe("buildListResourcesQuery", () => {
  it("always scopes to published resources", () => {
    const { sql } = buildListResourcesQuery({});
    expect(sql).toContain("is_published = 1");
    expect(sql).toContain("ORDER BY phase ASC, category ASC, topic ASC, title ASC");
  });

  it("adds filter clauses and bindings in order", () => {
    const { sql, bindings } = buildListResourcesQuery({
      category: "Networking",
      level: "beginner",
      resourceType: "article",
    });

    expect(sql).toContain("category = ?");
    expect(sql).toContain("level = ?");
    expect(sql).toContain("resource_type = ?");
    expect(bindings).toEqual(["Networking", "beginner", "article"]);
  });

  it("returns empty bindings when no filters are provided", () => {
    const { bindings } = buildListResourcesQuery({});
    expect(bindings).toEqual([]);
  });
});
