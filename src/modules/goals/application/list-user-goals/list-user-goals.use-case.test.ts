import { describe, expect, it, vi } from "vite-plus/test";

import { ListUserGoalsUseCase } from "#/modules/goals/application/list-user-goals/list-user-goals.use-case";
import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type { GoalsPort } from "#/modules/goals/domain/ports/goals-port";
import { err, ok } from "#/shared/domain/result";

const goal: LearningGoal = {
  id: "goal-1",
  userId: "app-1",
  title: "Learn web pentesting",
  description: null,
  targetDate: null,
  hoursPerWeek: 5,
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("ListUserGoalsUseCase", () => {
  it("returns goals for the user without mutating input", async () => {
    const listForUser = vi.fn().mockResolvedValue(ok([goal]));
    const goals: GoalsPort = {
      createForUser: vi.fn(),
      getByIdForUser: vi.fn(),
      listForUser,
      linkResource: vi.fn(),
      listLinkedResourcesForUser: vi.fn(),
    };
    const input = { userId: "app-1" };

    const useCase = new ListUserGoalsUseCase(goals);
    const result = await useCase.execute(input);

    expect(result).toEqual(ok({ goals: [goal] }));
    expect(listForUser).toHaveBeenCalledWith("app-1");
    expect(input).toEqual({ userId: "app-1" });
  });

  it("propagates goals port errors", async () => {
    const goals: GoalsPort = {
      createForUser: vi.fn(),
      getByIdForUser: vi.fn(),
      listForUser: vi.fn().mockResolvedValue(err({ type: "query_failed", message: "D1 down" })),
      linkResource: vi.fn(),
      listLinkedResourcesForUser: vi.fn(),
    };

    const useCase = new ListUserGoalsUseCase(goals);
    const result = await useCase.execute({ userId: "app-1" });

    expect(result).toEqual(err({ type: "query_failed", message: "D1 down" }));
  });
});
