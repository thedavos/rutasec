import { describe, expect, it } from "vite-plus/test";

import { mapGoalLinkedResourceRow } from "#/modules/goals/adapters/mappers/map-goal-linked-resource-row";

describe("mapGoalLinkedResourceRow", () => {
  it("maps snake_case rows to camelCase entities", () => {
    expect(
      mapGoalLinkedResourceRow({
        goal_id: "goal-1",
        resource_id: "res-1",
        priority: 1,
        linked_at: "2026-01-01T00:00:00.000Z",
        title: "Web Security",
        category: "Web",
        level: "beginner",
        resource_type: "course",
        estimated_hours: 6,
      }),
    ).toEqual({
      goalId: "goal-1",
      resourceId: "res-1",
      priority: 1,
      linkedAt: "2026-01-01T00:00:00.000Z",
      title: "Web Security",
      category: "Web",
      level: "beginner",
      resourceType: "course",
      estimatedHours: 6,
    });
  });
});
