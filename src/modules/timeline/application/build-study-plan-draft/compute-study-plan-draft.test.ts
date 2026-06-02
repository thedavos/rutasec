import { describe, expect, it } from "vite-plus/test";

import { computeStudyPlanDraft } from "#/modules/timeline/application/build-study-plan-draft/compute-study-plan-draft";
import type { TimelineResourceInput } from "#/modules/timeline/domain/entities/study-plan-draft";
import { invalidHoursPerWeekError } from "#/modules/timeline/domain/errors/timeline-errors";
import { err, ok } from "#/shared/domain/result";

const goalId = "goal-1";
const hoursPerWeek = 5;

const resource = (
  overrides: Partial<TimelineResourceInput> & Pick<TimelineResourceInput, "resourceId" | "title">,
): TimelineResourceInput => ({
  level: "beginner",
  estimatedHours: 2,
  priority: 1,
  ...overrides,
});

describe("computeStudyPlanDraft", () => {
  it("returns empty draft when there are no linked resources", () => {
    const result = computeStudyPlanDraft({ goalId, hoursPerWeek, resources: [] });

    expect(result).toEqual(
      ok({
        goalId,
        totalEstimatedHours: 0,
        estimatedWeeks: 0,
        items: [],
      }),
    );
  });

  it("returns empty draft when all resources are completed or discarded", () => {
    const result = computeStudyPlanDraft({
      goalId,
      hoursPerWeek,
      resources: [
        resource({
          resourceId: "res-1",
          title: "Done",
          libraryStatus: "completed",
          estimatedHours: 10,
        }),
        resource({
          resourceId: "res-2",
          title: "Dropped",
          libraryStatus: "discarded",
          estimatedHours: 8,
        }),
      ],
    });

    expect(result).toEqual(
      ok({
        goalId,
        totalEstimatedHours: 0,
        estimatedWeeks: 0,
        items: [],
      }),
    );
  });

  it("schedules only pending and in-progress resources when mixed with completed items", () => {
    const result = computeStudyPlanDraft({
      goalId,
      hoursPerWeek,
      resources: [
        resource({
          resourceId: "res-done",
          title: "Done",
          libraryStatus: "completed",
          estimatedHours: 10,
        }),
        resource({
          resourceId: "res-pending",
          title: "Pending",
          libraryStatus: "pending",
          estimatedHours: 3,
        }),
        resource({
          resourceId: "res-active",
          title: "Active",
          libraryStatus: "in_progress",
          estimatedHours: 4,
          progressPercentage: 25,
        }),
      ],
    });

    expect(result).toEqual(
      ok({
        goalId,
        totalEstimatedHours: 6,
        estimatedWeeks: 2,
        items: [
          {
            resourceId: "res-pending",
            title: "Pending",
            itemOrder: 1,
            weekNumber: 1,
            remainingHours: 3,
            status: "pending",
          },
          {
            resourceId: "res-active",
            title: "Active",
            itemOrder: 2,
            weekNumber: 2,
            remainingHours: 3,
            status: "in_progress",
          },
        ],
      }),
    );
  });

  it("breaks ties by level, estimated hours, then resource id", () => {
    const result = computeStudyPlanDraft({
      goalId,
      hoursPerWeek: 20,
      resources: [
        resource({
          resourceId: "res-z",
          title: "Advanced long",
          level: "advanced",
          estimatedHours: 10,
          priority: 1,
        }),
        resource({
          resourceId: "res-a",
          title: "Beginner short",
          level: "beginner",
          estimatedHours: 2,
          priority: 1,
        }),
        resource({
          resourceId: "res-m",
          title: "Intermediate medium",
          level: "intermediate",
          estimatedHours: 5,
          priority: 1,
        }),
      ],
    });

    expect(result.ok && result.value.items.map((item) => item.resourceId)).toEqual([
      "res-a",
      "res-m",
      "res-z",
    ]);
  });

  it("schedules beginner before advanced when priority matches regardless of input order", () => {
    const result = computeStudyPlanDraft({
      goalId,
      hoursPerWeek: 20,
      resources: [
        resource({
          resourceId: "res-advanced",
          title: "Advanced first in input",
          level: "advanced",
          estimatedHours: 4,
          priority: 1,
        }),
        resource({
          resourceId: "res-beginner",
          title: "Beginner second in input",
          level: "beginner",
          estimatedHours: 4,
          priority: 1,
        }),
      ],
    });

    expect(result.ok && result.value.items.map((item) => item.resourceId)).toEqual([
      "res-beginner",
      "res-advanced",
    ]);
  });

  it("uses half of estimated hours for in-progress resources at fifty percent", () => {
    const result = computeStudyPlanDraft({
      goalId,
      hoursPerWeek,
      resources: [
        resource({
          resourceId: "res-half",
          title: "Half done",
          libraryStatus: "in_progress",
          estimatedHours: 10,
          progressPercentage: 50,
        }),
      ],
    });

    expect(result).toEqual(
      ok({
        goalId,
        totalEstimatedHours: 5,
        estimatedWeeks: 1,
        items: [
          {
            resourceId: "res-half",
            title: "Half done",
            itemOrder: 1,
            weekNumber: 1,
            remainingHours: 5,
            status: "in_progress",
          },
        ],
      }),
    );
  });

  it("treats resources not in the library as pending with full estimated hours", () => {
    const result = computeStudyPlanDraft({
      goalId,
      hoursPerWeek,
      resources: [
        resource({
          resourceId: "res-new",
          title: "Not saved yet",
          estimatedHours: 6,
        }),
      ],
    });

    expect(result).toEqual(
      ok({
        goalId,
        totalEstimatedHours: 6,
        estimatedWeeks: 1,
        items: [
          {
            resourceId: "res-new",
            title: "Not saved yet",
            itemOrder: 1,
            weekNumber: 1,
            remainingHours: 6,
            status: "pending",
          },
        ],
      }),
    );
  });

  it("keeps an oversized resource alone in week one", () => {
    const result = computeStudyPlanDraft({
      goalId,
      hoursPerWeek: 5,
      resources: [
        resource({
          resourceId: "res-long",
          title: "Long course",
          estimatedHours: 12,
        }),
      ],
    });

    expect(result).toEqual(
      ok({
        goalId,
        totalEstimatedHours: 12,
        estimatedWeeks: 1,
        items: [
          {
            resourceId: "res-long",
            title: "Long course",
            itemOrder: 1,
            weekNumber: 1,
            remainingHours: 12,
            status: "pending",
          },
        ],
      }),
    );
  });

  it("packs three two-hour resources into two weeks at five hours per week", () => {
    const result = computeStudyPlanDraft({
      goalId,
      hoursPerWeek: 5,
      resources: [
        resource({ resourceId: "res-1", title: "One", priority: 1 }),
        resource({ resourceId: "res-2", title: "Two", priority: 2 }),
        resource({ resourceId: "res-3", title: "Three", priority: 3 }),
      ],
    });

    expect(result).toEqual(
      ok({
        goalId,
        totalEstimatedHours: 6,
        estimatedWeeks: 2,
        items: [
          {
            resourceId: "res-1",
            title: "One",
            itemOrder: 1,
            weekNumber: 1,
            remainingHours: 2,
            status: "pending",
          },
          {
            resourceId: "res-2",
            title: "Two",
            itemOrder: 2,
            weekNumber: 1,
            remainingHours: 2,
            status: "pending",
          },
          {
            resourceId: "res-3",
            title: "Three",
            itemOrder: 3,
            weekNumber: 2,
            remainingHours: 2,
            status: "pending",
          },
        ],
      }),
    );
  });

  it("excludes in-progress resources whose remaining hours round to zero", () => {
    const result = computeStudyPlanDraft({
      goalId,
      hoursPerWeek,
      resources: [
        resource({
          resourceId: "res-almost-done",
          title: "Almost done",
          libraryStatus: "in_progress",
          estimatedHours: 1,
          progressPercentage: 99.95,
        }),
      ],
    });

    expect(result).toEqual(
      ok({
        goalId,
        totalEstimatedHours: 0,
        estimatedWeeks: 0,
        items: [],
      }),
    );
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "returns InvalidHoursPerWeek for invalid hoursPerWeek %s",
    (invalidHours) => {
      const result = computeStudyPlanDraft({
        goalId,
        hoursPerWeek: invalidHours,
        resources: [resource({ resourceId: "res-1", title: "One" })],
      });

      expect(result).toEqual(err(invalidHoursPerWeekError()));
    },
  );
});
