import { describe, expect, it } from "vite-plus/test";

import { BuildStudyPlanDraftUseCase } from "#/modules/timeline/application/build-study-plan-draft/build-study-plan-draft.use-case";
import { computeStudyPlanDraft } from "#/modules/timeline/application/build-study-plan-draft/compute-study-plan-draft";
import type { TimelinePlanningInput } from "#/modules/timeline/domain/entities/study-plan-draft";

describe("BuildStudyPlanDraftUseCase", () => {
  it("delegates to the pure timeline planner", () => {
    const input: TimelinePlanningInput = {
      goalId: "goal-1",
      hoursPerWeek: 5,
      resources: [
        {
          resourceId: "res-1",
          title: "Intro",
          level: "beginner",
          estimatedHours: 2,
          priority: 1,
        },
      ],
    };

    expect(new BuildStudyPlanDraftUseCase().execute(input)).toEqual(computeStudyPlanDraft(input));
  });
});
