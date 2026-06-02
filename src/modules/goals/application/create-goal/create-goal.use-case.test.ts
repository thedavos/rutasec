import { describe, expect, it, vi } from "vite-plus/test";

import { CreateGoalUseCase } from "#/modules/goals/application/create-goal/create-goal.use-case";
import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type { GoalsPort } from "#/modules/goals/domain/ports/goals-port";
import { ok } from "#/shared/domain/result";

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

describe("CreateGoalUseCase", () => {
  it("delegates to the goals port with user-scoped input", async () => {
    const createForUser = vi.fn().mockResolvedValue(ok(goal));
    const goals: GoalsPort = {
      createForUser,
      getByIdForUser: vi.fn(),
      listForUser: vi.fn(),
      linkResource: vi.fn(),
      listLinkedResourcesForUser: vi.fn(),
    };
    const input = {
      userId: "app-1",
      title: "Learn web pentesting",
      hoursPerWeek: 5,
    };

    const useCase = new CreateGoalUseCase(goals);
    const result = await useCase.execute(input);

    expect(result).toEqual(ok(goal));
    expect(createForUser).toHaveBeenCalledWith({
      userId: "app-1",
      title: "Learn web pentesting",
      description: undefined,
      targetDate: undefined,
      hoursPerWeek: 5,
    });
    expect(input).toEqual({
      userId: "app-1",
      title: "Learn web pentesting",
      hoursPerWeek: 5,
    });
  });
});
