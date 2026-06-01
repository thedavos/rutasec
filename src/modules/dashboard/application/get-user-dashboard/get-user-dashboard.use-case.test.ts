import { describe, expect, it, vi } from "vite-plus/test";

import { GetUserDashboardUseCase } from "#/modules/dashboard/application/get-user-dashboard/get-user-dashboard.use-case";
import type { ListGoalLinkedResources } from "#/modules/goals/application/list-goal-linked-resources/list-goal-linked-resources";
import type { ListUserGoals } from "#/modules/goals/application/list-user-goals/list-user-goals";
import type { GetPersonalLibrary } from "#/modules/library/application/get-personal-library/get-personal-library";
import { err, ok } from "#/shared/domain/result";

describe("GetUserDashboardUseCase", () => {
  it("aggregates goals, library, and linked resources into a dashboard", async () => {
    const listUserGoals = {
      execute: vi.fn().mockResolvedValue(
        ok({
          goals: [
            {
              id: "goal-1",
              userId: "app-1",
              title: "Learn web",
              description: null,
              targetDate: null,
              hoursPerWeek: 5,
              status: "active" as const,
              createdAt: "2026-01-01T00:00:00.000Z",
              updatedAt: "2026-01-01T00:00:00.000Z",
            },
          ],
        }),
      ),
    } satisfies ListUserGoals;

    const getPersonalLibrary = {
      execute: vi.fn().mockResolvedValue(
        ok({
          items: [
            {
              userResourceId: "ur-1",
              resourceId: "res-1",
              status: "pending" as const,
              progressPercentage: 0,
              savedAt: "2026-01-01T00:00:00.000Z",
              title: "Intro",
              category: "Web",
              level: "beginner" as const,
              resourceType: "course" as const,
              estimatedHours: 6,
            },
          ],
          statusFilter: null,
        }),
      ),
    } satisfies GetPersonalLibrary;

    const listGoalLinkedResources = {
      execute: vi.fn().mockResolvedValue(ok([])),
    } satisfies ListGoalLinkedResources;

    const useCase = new GetUserDashboardUseCase(
      listUserGoals,
      getPersonalLibrary,
      listGoalLinkedResources,
    );

    const result = await useCase.execute({ userId: "app-1" });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.focusGoal?.id).toBe("goal-1");
    expect(result.value.progress.totalSaved).toBe(1);
    expect(result.value.isEmpty).toBe(false);
    expect(listUserGoals.execute).toHaveBeenCalledWith({ userId: "app-1" });
    expect(getPersonalLibrary.execute).toHaveBeenCalledWith({ userId: "app-1" });
    expect(listGoalLinkedResources.execute).toHaveBeenCalledWith({ userId: "app-1" });
  });

  it("propagates goal errors", async () => {
    const useCase = new GetUserDashboardUseCase(
      { execute: vi.fn().mockResolvedValue(err({ type: "query_failed", message: "goals down" })) },
      { execute: vi.fn() },
      { execute: vi.fn() },
    );

    const result = await useCase.execute({ userId: "app-1" });

    expect(result).toEqual(err({ type: "query_failed", message: "goals down" }));
  });

  it("propagates library errors", async () => {
    const useCase = new GetUserDashboardUseCase(
      { execute: vi.fn().mockResolvedValue(ok({ goals: [] })) },
      {
        execute: vi.fn().mockResolvedValue(err({ type: "query_failed", message: "library down" })),
      },
      { execute: vi.fn() },
    );

    const result = await useCase.execute({ userId: "app-1" });

    expect(result).toEqual(err({ type: "query_failed", message: "library down" }));
  });
});
