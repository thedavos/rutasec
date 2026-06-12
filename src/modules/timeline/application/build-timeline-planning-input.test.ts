import { describe, expect, it } from "vite-plus/test";

import { buildTimelinePlanningInput } from "#/modules/timeline/application/build-timeline-planning-input";
import type { LearningGoal } from "#/modules/goals/domain/entities/goal";

const goal: LearningGoal = {
  id: "goal-1",
  userId: "user-1",
  title: "Learn web pentesting",
  description: null,
  targetDate: null,
  hoursPerWeek: 5,
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("buildTimelinePlanningInput", () => {
  it("merges linked resources with library progress for the goal", () => {
    const result = buildTimelinePlanningInput(
      goal,
      [
        {
          goalId: "goal-1",
          resourceId: "res-1",
          title: "Web Security",
          category: "Web",
          level: "beginner",
          resourceType: "course",
          estimatedHours: 6,
          priority: 0,
          linkedAt: "2026-01-01T00:00:00.000Z",
        },
        {
          goalId: "goal-2",
          resourceId: "res-2",
          title: "Other goal",
          category: "Web",
          level: "beginner",
          resourceType: "course",
          estimatedHours: 4,
          priority: 0,
          linkedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      [
        {
          userResourceId: "ur-1",
          resourceId: "res-1",
          status: "in_progress",
          progressPercentage: 50,
          savedAt: "2026-01-01T00:00:00.000Z",
          title: "Web Security",
          iconUrl: null,
          category: "Web",
          level: "beginner",
          resourceType: "course",
          estimatedHours: 6,
        },
      ],
    );

    expect(result).toEqual({
      ok: true,
      value: {
        goalId: "goal-1",
        hoursPerWeek: 5,
        resources: [
          {
            resourceId: "res-1",
            title: "Web Security",
            level: "beginner",
            estimatedHours: 6,
            priority: 0,
            libraryStatus: "in_progress",
            progressPercentage: 50,
          },
        ],
      },
    });
  });

  it("returns invalid_resource_level when level is unknown", () => {
    const result = buildTimelinePlanningInput(
      goal,
      [
        {
          goalId: "goal-1",
          resourceId: "res-1",
          title: "Bad level",
          category: "Web",
          level: "expert",
          resourceType: "course",
          estimatedHours: 6,
          priority: 0,
          linkedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      [],
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe("invalid_resource_level");
    }
  });
});
