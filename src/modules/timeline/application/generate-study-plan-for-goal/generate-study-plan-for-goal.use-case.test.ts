import { describe, expect, it, vi } from "vite-plus/test";

import { BuildStudyPlanDraftUseCase } from "#/modules/timeline/application/build-study-plan-draft/build-study-plan-draft.use-case";
import { GenerateStudyPlanForGoalUseCase } from "#/modules/timeline/application/generate-study-plan-for-goal/generate-study-plan-for-goal.use-case";
import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type { GoalsPort } from "#/modules/goals/domain/ports/goals-port";
import type { GetPersonalLibrary } from "#/modules/library/application/get-personal-library/get-personal-library";
import type { StudyPlanPort } from "#/modules/timeline/domain/ports/study-plan-port";
import { err, ok } from "#/shared/domain/result";

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

const persistedPlan = {
  id: "plan-1",
  userId: "user-1",
  goalId: "goal-1",
  title: "Learn web pentesting study plan",
  totalEstimatedHours: 4,
  estimatedWeeks: 1,
  status: "active" as const,
  generatedBy: "system" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  items: [
    {
      id: "item-1",
      studyPlanId: "plan-1",
      resourceId: "res-1",
      itemOrder: 1,
      weekNumber: 1,
      status: "pending" as const,
      estimatedStartDate: null,
      estimatedEndDate: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ],
};

describe("GenerateStudyPlanForGoalUseCase", () => {
  it("generates a draft and replaces the active plan", async () => {
    const replaceGeneratedPlan = vi.fn().mockResolvedValue(ok(persistedPlan));
    const goals: GoalsPort = {
      createForUser: vi.fn(),
      getByIdForUser: vi.fn().mockResolvedValue(ok(goal)),
      listForUser: vi.fn(),
      linkResource: vi.fn(),
      listLinkedResourcesForUser: vi.fn().mockResolvedValue(
        ok([
          {
            goalId: "goal-1",
            resourceId: "res-1",
            title: "Web Security",
            category: "Web",
            level: "beginner",
            resourceType: "course",
            estimatedHours: 4,
            priority: 0,
            linkedAt: "2026-01-01T00:00:00.000Z",
          },
        ]),
      ),
    };
    const getPersonalLibrary = {
      execute: vi.fn().mockResolvedValue(ok({ items: [], statusFilter: null })),
    } satisfies GetPersonalLibrary;
    const studyPlans: StudyPlanPort = {
      replaceGeneratedPlan,
      getActiveByGoalForUser: vi.fn(),
    };

    const useCase = new GenerateStudyPlanForGoalUseCase(
      goals,
      getPersonalLibrary,
      new BuildStudyPlanDraftUseCase(),
      studyPlans,
    );

    const result = await useCase.execute({ userId: "user-1", goalId: "goal-1" });

    expect(result).toEqual(ok(persistedPlan));
    expect(replaceGeneratedPlan).toHaveBeenCalledWith({
      userId: "user-1",
      goalId: "goal-1",
      title: "Learn web pentesting study plan",
      draft: {
        goalId: "goal-1",
        totalEstimatedHours: 4,
        estimatedWeeks: 1,
        items: [
          expect.objectContaining({
            resourceId: "res-1",
            itemOrder: 1,
            weekNumber: 1,
            status: "pending",
          }),
        ],
      },
    });
  });

  it("excludes completed resources from the draft", async () => {
    const replaceGeneratedPlan = vi.fn().mockResolvedValue(
      ok({
        ...persistedPlan,
        totalEstimatedHours: 0,
        estimatedWeeks: 0,
        items: [],
      }),
    );
    const goals: GoalsPort = {
      createForUser: vi.fn(),
      getByIdForUser: vi.fn().mockResolvedValue(ok(goal)),
      listForUser: vi.fn(),
      linkResource: vi.fn(),
      listLinkedResourcesForUser: vi.fn().mockResolvedValue(
        ok([
          {
            goalId: "goal-1",
            resourceId: "res-1",
            title: "Done",
            category: "Web",
            level: "beginner",
            resourceType: "course",
            estimatedHours: 4,
            priority: 0,
            linkedAt: "2026-01-01T00:00:00.000Z",
          },
        ]),
      ),
    };
    const getPersonalLibrary = {
      execute: vi.fn().mockResolvedValue(
        ok({
          items: [
            {
              userResourceId: "ur-1",
              resourceId: "res-1",
              status: "completed",
              progressPercentage: 100,
              savedAt: "2026-01-01T00:00:00.000Z",
              title: "Done",
              category: "Web",
              level: "beginner",
              resourceType: "course",
              estimatedHours: 4,
            },
          ],
          statusFilter: null,
        }),
      ),
    } satisfies GetPersonalLibrary;
    const studyPlans: StudyPlanPort = {
      replaceGeneratedPlan,
      getActiveByGoalForUser: vi.fn(),
    };

    const useCase = new GenerateStudyPlanForGoalUseCase(
      goals,
      getPersonalLibrary,
      new BuildStudyPlanDraftUseCase(),
      studyPlans,
    );

    const result = await useCase.execute({ userId: "user-1", goalId: "goal-1" });

    expect(result.ok).toBe(true);
    expect(replaceGeneratedPlan).toHaveBeenCalledWith(
      expect.objectContaining({
        draft: expect.objectContaining({ items: [] }),
      }),
    );
  });

  it("returns invalid_hours_per_week when goal hours are invalid", async () => {
    const goals: GoalsPort = {
      createForUser: vi.fn(),
      getByIdForUser: vi.fn().mockResolvedValue(ok({ ...goal, hoursPerWeek: Number.NaN })),
      listForUser: vi.fn(),
      linkResource: vi.fn(),
      listLinkedResourcesForUser: vi.fn().mockResolvedValue(ok([])),
    };
    const getPersonalLibrary = {
      execute: vi.fn().mockResolvedValue(ok({ items: [], statusFilter: null })),
    } satisfies GetPersonalLibrary;
    const studyPlans: StudyPlanPort = {
      replaceGeneratedPlan: vi.fn(),
      getActiveByGoalForUser: vi.fn(),
    };

    const useCase = new GenerateStudyPlanForGoalUseCase(
      goals,
      getPersonalLibrary,
      new BuildStudyPlanDraftUseCase(),
      studyPlans,
    );

    const result = await useCase.execute({ userId: "user-1", goalId: "goal-1" });

    expect(result).toEqual({ ok: false, error: { type: "invalid_hours_per_week" } });
  });

  it("returns goal_not_found when the goal is missing", async () => {
    const goals: GoalsPort = {
      createForUser: vi.fn(),
      getByIdForUser: vi
        .fn()
        .mockResolvedValue(err({ type: "goal_not_found", message: "Goal not found." })),
      listForUser: vi.fn(),
      linkResource: vi.fn(),
      listLinkedResourcesForUser: vi.fn(),
    };
    const getPersonalLibrary = { execute: vi.fn() } satisfies GetPersonalLibrary;
    const studyPlans: StudyPlanPort = {
      replaceGeneratedPlan: vi.fn(),
      getActiveByGoalForUser: vi.fn(),
    };

    const useCase = new GenerateStudyPlanForGoalUseCase(
      goals,
      getPersonalLibrary,
      new BuildStudyPlanDraftUseCase(),
      studyPlans,
    );

    const result = await useCase.execute({ userId: "user-1", goalId: "goal-missing" });

    expect(result).toEqual({
      ok: false,
      error: { type: "goal_not_found", message: "Goal not found." },
    });
  });
});
