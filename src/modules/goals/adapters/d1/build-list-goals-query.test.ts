import { describe, expect, it } from "vite-plus/test";

import { buildListGoalsQuery } from "#/modules/goals/adapters/d1/build-list-goals-query";

describe("buildListGoalsQuery", () => {
  it("lists goals scoped to user_id ordered by created_at desc", () => {
    const { sql, bindings } = buildListGoalsQuery("user-1");

    expect(sql).toContain("FROM goals");
    expect(sql).toContain("WHERE user_id = ?");
    expect(sql).toContain("ORDER BY created_at DESC");
    expect(bindings).toEqual({ userId: "user-1" });
  });
});
