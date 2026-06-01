import { describe, expect, it } from "vite-plus/test";

import {
  buildListResourcesQuery,
  tokenizeSearchQuery,
} from "#/modules/catalog/adapters/d1/build-list-resources-query";

describe("buildListResourcesQuery", () => {
  it("always scopes to published resources", () => {
    const { sql } = buildListResourcesQuery({});
    expect(sql).toContain("is_published = 1");
    expect(sql).toContain("original_source_url");
    expect(sql).toContain("curated_from_url");
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

  it("tokenizeSearchQuery splits on whitespace", () => {
    expect(tokenizeSearchQuery("  sql injection  ")).toEqual(["sql", "injection"]);
  });

  it("adds case-insensitive search with tag EXISTS for a single token", () => {
    const { sql, bindings } = buildListResourcesQuery({ q: "linux" });

    expect(sql).toContain("LOWER(title) LIKE LOWER(?)");
    expect(sql).toContain("resource_tags rt");
    expect(sql).toContain("INNER JOIN tags t");
    expect(bindings).toEqual(["%linux%", "%linux%", "%linux%", "%linux%", "%linux%"]);
  });

  it("ANDs multiple search tokens", () => {
    const { sql, bindings } = buildListResourcesQuery({ q: "sql injection" });

    const searchGroups = sql.match(/LOWER\(title\) LIKE LOWER\(\?\)/g);
    expect(searchGroups).toHaveLength(2);
    expect(bindings).toEqual([
      "%sql%",
      "%sql%",
      "%sql%",
      "%sql%",
      "%sql%",
      "%injection%",
      "%injection%",
      "%injection%",
      "%injection%",
      "%injection%",
    ]);
  });

  it("combines search with enum filters", () => {
    const { sql, bindings } = buildListResourcesQuery({
      q: "linux",
      level: "beginner",
    });

    expect(sql).toContain("level = ?");
    expect(sql).toContain("LOWER(title) LIKE LOWER(?)");
    expect(bindings[0]).toBe("beginner");
    expect(bindings.slice(1)).toEqual(["%linux%", "%linux%", "%linux%", "%linux%", "%linux%"]);
  });
});
