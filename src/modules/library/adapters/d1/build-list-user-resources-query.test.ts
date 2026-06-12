import { describe, expect, it } from "vite-plus/test";

import { buildListUserResourcesQuery } from "#/modules/library/adapters/d1/build-list-user-resources-query";

describe("buildListUserResourcesQuery", () => {
  it("scopes by user_id and joins resources", () => {
    const { sql, bindings } = buildListUserResourcesQuery("app-1");

    expect(sql).toContain("FROM user_resources ur");
    expect(sql).toContain("INNER JOIN resources r");
    expect(sql).toContain("r.icon_url");
    expect(sql).toContain("ur.user_id = ?");
    expect(sql).not.toContain("ur.status = ?");
    expect(sql).toContain("ORDER BY ur.updated_at DESC");
    expect(bindings).toEqual({ userId: "app-1" });
  });

  it("adds status filter and binding when status is provided", () => {
    const { sql, bindings } = buildListUserResourcesQuery("app-1", "in_progress");

    expect(sql).toContain("ur.status = ?");
    expect(bindings).toEqual({ userId: "app-1", status: "in_progress" });
  });
});
