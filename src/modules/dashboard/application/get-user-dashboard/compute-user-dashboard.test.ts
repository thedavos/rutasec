import { describe, expect, it } from "vite-plus/test";

import { computeUserDashboard } from "#/modules/dashboard/application/get-user-dashboard/compute-user-dashboard";
import type { GoalLinkedResource } from "#/modules/goals/domain/entities/goal-linked-resource";
import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type { PersonalLibraryItem } from "#/modules/library/domain/entities/personal-library-item";

const baseGoal: LearningGoal = {
  id: "goal-1",
  userId: "app-1",
  title: "Web pentesting",
  description: null,
  targetDate: "2026-12-31",
  hoursPerWeek: 5,
  status: "active",
  createdAt: "2026-01-02T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

const baseItem = (
  overrides: Partial<PersonalLibraryItem> & Pick<PersonalLibraryItem, "resourceId" | "title">,
): PersonalLibraryItem => ({
  userResourceId: `ur-${overrides.resourceId}`,
  status: "pending",
  progressPercentage: 0,
  savedAt: "2026-01-01T00:00:00.000Z",
  category: "Web",
  level: "beginner",
  resourceType: "course",
  estimatedHours: 10,
  ...overrides,
});

describe("computeUserDashboard", () => {
  it("returns empty dashboard when user has no goals or library items", () => {
    const result = computeUserDashboard({
      goals: [],
      libraryItems: [],
      linkedResources: [],
    });

    expect(result.isEmpty).toBe(true);
    expect(result.focusGoal).toBeNull();
    expect(result.progress.totalSaved).toBe(0);
    expect(result.pendingHoursEstimate).toBe(0);
    expect(result.nextResources).toEqual([]);
  });

  it("picks the active goal before a newer paused goal", () => {
    const pausedGoal: LearningGoal = {
      ...baseGoal,
      id: "goal-2",
      title: "Newer paused",
      status: "paused",
      createdAt: "2026-02-01T00:00:00.000Z",
    };

    const result = computeUserDashboard({
      goals: [pausedGoal, baseGoal],
      libraryItems: [baseItem({ resourceId: "res-1", title: "Intro" })],
      linkedResources: [],
    });

    expect(result.focusGoal?.id).toBe("goal-1");
    expect(result.isEmpty).toBe(false);
  });

  it("falls back to the latest goal when none are active", () => {
    const pausedGoal: LearningGoal = {
      ...baseGoal,
      status: "paused",
    };

    const result = computeUserDashboard({
      goals: [pausedGoal],
      libraryItems: [],
      linkedResources: [],
    });

    expect(result.focusGoal?.id).toBe("goal-1");
  });

  it("aggregates progress counts and overall completion percent", () => {
    const result = computeUserDashboard({
      goals: [baseGoal],
      libraryItems: [
        baseItem({ resourceId: "res-1", title: "A", status: "completed" }),
        baseItem({ resourceId: "res-2", title: "B", status: "in_progress" }),
        baseItem({ resourceId: "res-3", title: "C", status: "pending" }),
        baseItem({ resourceId: "res-4", title: "D", status: "discarded" }),
      ],
      linkedResources: [],
    });

    expect(result.progress).toEqual({
      totalSaved: 4,
      pending: 1,
      inProgress: 1,
      completed: 1,
      discarded: 1,
      overallProgressPercent: 25,
    });
  });

  it("sums remaining hours for pending and in-progress resources", () => {
    const result = computeUserDashboard({
      goals: [baseGoal],
      libraryItems: [
        baseItem({
          resourceId: "res-1",
          title: "Pending",
          status: "pending",
          estimatedHours: 10,
          progressPercentage: 0,
        }),
        baseItem({
          resourceId: "res-2",
          title: "Half done",
          status: "in_progress",
          estimatedHours: 8,
          progressPercentage: 50,
        }),
        baseItem({
          resourceId: "res-3",
          title: "Done",
          status: "completed",
          estimatedHours: 20,
          progressPercentage: 100,
        }),
      ],
      linkedResources: [],
    });

    expect(result.pendingHoursEstimate).toBe(14);
  });

  it("orders next resources as in-progress, goal-linked pending, then other pending", () => {
    const linked: GoalLinkedResource[] = [
      {
        goalId: "goal-1",
        resourceId: "res-linked-low",
        title: "Linked low priority",
        category: "Web",
        level: "beginner",
        resourceType: "course",
        estimatedHours: 6,
        priority: 2,
        linkedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        goalId: "goal-1",
        resourceId: "res-linked-high",
        title: "Linked high priority",
        category: "Web",
        level: "beginner",
        resourceType: "course",
        estimatedHours: 4,
        priority: 1,
        linkedAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    const result = computeUserDashboard({
      goals: [baseGoal],
      libraryItems: [
        baseItem({ resourceId: "res-other-pending", title: "Other pending", status: "pending" }),
        baseItem({
          resourceId: "res-in-progress",
          title: "In progress",
          status: "in_progress",
        }),
        baseItem({
          resourceId: "res-linked-high",
          title: "Linked high priority",
          status: "pending",
        }),
        baseItem({
          resourceId: "res-linked-low",
          title: "Linked low priority",
          status: "pending",
        }),
        baseItem({ resourceId: "res-completed", title: "Done", status: "completed" }),
      ],
      linkedResources: linked,
    });

    expect(result.nextResources.map((resource) => resource.resourceId)).toEqual([
      "res-in-progress",
      "res-linked-high",
      "res-linked-low",
      "res-other-pending",
    ]);
  });

  it("caps next resources at six items", () => {
    const items = Array.from({ length: 8 }, (_, index) =>
      baseItem({
        resourceId: `res-${index}`,
        title: `Resource ${index}`,
        status: "pending",
      }),
    );

    const result = computeUserDashboard({
      goals: [baseGoal],
      libraryItems: items,
      linkedResources: [],
    });

    expect(result.nextResources).toHaveLength(6);
  });
});
