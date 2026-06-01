import { describe, expect, it } from "vite-plus/test";

import { buildListGoalLinkedResourcesQuery } from "#/modules/goals/adapters/d1/build-list-goal-linked-resources-query";

describe("buildListGoalLinkedResourcesQuery", () => {
  it("joins goal_resources to goals and resources for the user", () => {
    const query = buildListGoalLinkedResourcesQuery("user-1");

    expect(query.sql).toContain("FROM goal_resources gr");
    expect(query.sql).toContain("INNER JOIN goals g ON g.id = gr.goal_id");
    expect(query.sql).toContain("INNER JOIN resources r ON r.id = gr.resource_id");
    expect(query.sql).toContain("WHERE g.user_id = ?");
    expect(query.sql).toContain("ORDER BY gr.goal_id, gr.priority, gr.created_at");
    expect(query.bindings).toEqual({ userId: "user-1" });
  });
});
