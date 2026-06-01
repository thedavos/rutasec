import { describe, expect, it } from "vite-plus/test";

import { groupGoalLinkedResourcesByGoalId } from "#/modules/goals/presentation/group-goal-linked-resources";

describe("groupGoalLinkedResourcesByGoalId", () => {
  it("groups linked resources by goal id without mutating input", () => {
    const linked = [
      {
        goalId: "goal-1",
        resourceId: "res-1",
        title: "A",
        category: "Web",
        level: "beginner",
        resourceType: "course",
        priority: 0,
        linkedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        goalId: "goal-2",
        resourceId: "res-2",
        title: "B",
        category: "Web",
        level: "beginner",
        resourceType: "course",
        priority: 0,
        linkedAt: "2026-01-02T00:00:00.000Z",
      },
      {
        goalId: "goal-1",
        resourceId: "res-3",
        title: "C",
        category: "Web",
        level: "beginner",
        resourceType: "course",
        priority: 1,
        linkedAt: "2026-01-03T00:00:00.000Z",
      },
    ];

    const grouped = groupGoalLinkedResourcesByGoalId(linked);

    expect(grouped.get("goal-1")).toHaveLength(2);
    expect(grouped.get("goal-2")).toHaveLength(1);
    expect(linked).toHaveLength(3);
  });
});
