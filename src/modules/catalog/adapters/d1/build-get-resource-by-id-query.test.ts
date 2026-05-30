import { describe, expect, it } from "vite-plus/test";

import {
  buildGetResourceByIdQuery,
  buildResourceTagSlugsQuery,
} from "#/modules/catalog/adapters/d1/build-get-resource-by-id-query";

describe("buildGetResourceByIdQuery", () => {
  it("selects published resource by id with path joins", () => {
    const query = buildGetResourceByIdQuery("res-linux-journey");

    expect(query.bindings).toEqual(["res-linux-journey"]);
    expect(query.sql).toContain("FROM resources r");
    expect(query.sql).toContain("LEFT JOIN learning_path_items lpi");
    expect(query.sql).toContain("LEFT JOIN learning_paths lp");
    expect(query.sql).toContain("r.is_published = 1");
    expect(query.sql).toContain("lp.is_published = 1");
    expect(query.sql).toContain("WHERE r.id = ?");
    expect(query.sql).toContain("original_source_url");
    expect(query.sql).toContain("roadmap_section");
    expect(query.sql).toContain("path_total");
  });
});

describe("buildResourceTagSlugsQuery", () => {
  it("selects tag slugs for a resource id", () => {
    const query = buildResourceTagSlugsQuery("res-linux-journey");

    expect(query.bindings).toEqual(["res-linux-journey"]);
    expect(query.sql).toContain("FROM tags t");
    expect(query.sql).toContain("INNER JOIN resource_tags rt");
    expect(query.sql).toContain("WHERE rt.resource_id = ?");
    expect(query.sql).toContain("ORDER BY t.slug ASC");
  });
});
