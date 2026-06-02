import { describe, expect, it, vi } from "vite-plus/test";

import { GetStudyPlanForGoalUseCase } from "#/modules/timeline/application/get-study-plan-for-goal/get-study-plan-for-goal.use-case";
import type { StudyPlanPort } from "#/modules/timeline/domain/ports/study-plan-port";
import { ok } from "#/shared/domain/result";

describe("GetStudyPlanForGoalUseCase", () => {
  it("delegates to StudyPlanPort.getActiveByGoalForUser", async () => {
    const plan = {
      id: "plan-1",
      userId: "user-1",
      goalId: "goal-1",
      title: "Plan",
      totalEstimatedHours: 4,
      estimatedWeeks: 1,
      status: "active" as const,
      generatedBy: "system" as const,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      items: [],
    };
    const getActiveByGoalForUser = vi.fn().mockResolvedValue(ok(plan));
    const studyPlans: StudyPlanPort = {
      replaceGeneratedPlan: vi.fn(),
      getActiveByGoalForUser,
    };

    const useCase = new GetStudyPlanForGoalUseCase(studyPlans);
    const result = await useCase.execute({ userId: "user-1", goalId: "goal-1" });

    expect(result).toEqual(ok(plan));
    expect(getActiveByGoalForUser).toHaveBeenCalledWith({ userId: "user-1", goalId: "goal-1" });
  });

  it("returns null when no active plan exists", async () => {
    const getActiveByGoalForUser = vi.fn().mockResolvedValue(ok(null));
    const studyPlans: StudyPlanPort = {
      replaceGeneratedPlan: vi.fn(),
      getActiveByGoalForUser,
    };

    const useCase = new GetStudyPlanForGoalUseCase(studyPlans);
    const result = await useCase.execute({ userId: "user-1", goalId: "goal-1" });

    expect(result).toEqual(ok(null));
  });
});
