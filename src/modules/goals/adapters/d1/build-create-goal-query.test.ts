import { describe, expect, it } from "vite-plus/test";

import {
  buildCreateGoalQuery,
  buildSelectGoalByIdQuery,
} from "#/modules/goals/adapters/d1/build-create-goal-query";

describe("buildCreateGoalQuery", () => {
  it("inserts with active status and binds all fields", () => {
    const { sql, bindings } = buildCreateGoalQuery(
      "goal-1",
      "user-1",
      "Learn Linux",
      "Basics first",
      "2026-06-01",
      4,
      "2026-01-01T00:00:00.000Z",
    );

    expect(sql).toContain("INSERT INTO goals");
    expect(sql).toContain("'active'");
    expect(bindings).toEqual({
      id: "goal-1",
      userId: "user-1",
      title: "Learn Linux",
      description: "Basics first",
      targetDate: "2026-06-01",
      hoursPerWeek: 4,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
  });
});

describe("buildSelectGoalByIdQuery", () => {
  it("scopes by goal id and user id", () => {
    const { sql, bindings } = buildSelectGoalByIdQuery("goal-1", "user-1");

    expect(sql).toContain("FROM goals");
    expect(sql).toContain("WHERE id = ? AND user_id = ?");
    expect(bindings).toEqual({ id: "goal-1", userId: "user-1" });
  });
});
