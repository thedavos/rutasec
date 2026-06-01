import { describe, expect, it } from "vite-plus/test";

import { mapGoalRow } from "#/modules/goals/adapters/mappers/map-goal-row";
import type { GoalRow } from "#/modules/goals/adapters/schemas/goal-row.schema";

const row: GoalRow = {
  id: "goal-1",
  user_id: "user-1",
  title: "Learn web pentesting",
  description: "Focus on OWASP Top 10",
  target_date: "2026-12-31",
  hours_per_week: 5,
  status: "active",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("mapGoalRow", () => {
  it("maps snake_case rows to camelCase goal entities", () => {
    expect(mapGoalRow(row)).toEqual({
      id: "goal-1",
      userId: "user-1",
      title: "Learn web pentesting",
      description: "Focus on OWASP Top 10",
      targetDate: "2026-12-31",
      hoursPerWeek: 5,
      status: "active",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
  });
});
