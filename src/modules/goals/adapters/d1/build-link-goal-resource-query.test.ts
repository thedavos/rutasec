import { describe, expect, it } from "vite-plus/test";

import {
  buildGoalOwnedByUserQuery,
  buildGoalResourceLinkExistsQuery,
  buildLinkGoalResourceQuery,
} from "#/modules/goals/adapters/d1/build-link-goal-resource-query";

describe("buildLinkGoalResourceQuery", () => {
  it("inserts with goal and library guards", () => {
    const query = buildLinkGoalResourceQuery(
      "goal-1",
      "res-1",
      "user-1",
      "2026-01-01T00:00:00.000Z",
    );

    expect(query.sql).toContain("INSERT OR IGNORE INTO goal_resources");
    expect(query.sql).toContain("EXISTS (SELECT 1 FROM goals WHERE id = ? AND user_id = ?)");
    expect(query.sql).toContain("FROM user_resources WHERE user_id = ? AND resource_id = ?");
    expect(query.bindings).toEqual({
      goalId: "goal-1",
      resourceId: "res-1",
      createdAt: "2026-01-01T00:00:00.000Z",
      userId: "user-1",
    });
  });
});

describe("buildGoalResourceLinkExistsQuery", () => {
  it("scopes the link check to the goal owner", () => {
    const query = buildGoalResourceLinkExistsQuery("goal-1", "res-1", "user-1");

    expect(query.sql).toContain("INNER JOIN goals g ON g.id = gr.goal_id");
    expect(query.sql).toContain("g.user_id = ?");
    expect(query.bindings).toEqual({
      goalId: "goal-1",
      resourceId: "res-1",
      userId: "user-1",
    });
  });
});

describe("buildGoalOwnedByUserQuery", () => {
  it("checks goal ownership by user id", () => {
    const query = buildGoalOwnedByUserQuery("goal-1", "user-1");

    expect(query.sql).toContain("FROM goals");
    expect(query.sql).toContain("id = ? AND user_id = ?");
    expect(query.bindings).toEqual({ goalId: "goal-1", userId: "user-1" });
  });
});
