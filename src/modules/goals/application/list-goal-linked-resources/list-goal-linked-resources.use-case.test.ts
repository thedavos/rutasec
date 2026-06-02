import { describe, expect, it, vi } from "vite-plus/test";

import { ListGoalLinkedResourcesUseCase } from "#/modules/goals/application/list-goal-linked-resources/list-goal-linked-resources.use-case";
import type { GoalsPort } from "#/modules/goals/domain/ports/goals-port";
import { ok } from "#/shared/domain/result";

describe("ListGoalLinkedResourcesUseCase", () => {
  it("delegates to GoalsPort.listLinkedResourcesForUser", async () => {
    const linked = [
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
    ];
    const listLinkedResourcesForUser = vi.fn().mockResolvedValue(ok(linked));
    const goals: GoalsPort = {
      createForUser: vi.fn(),
      getByIdForUser: vi.fn(),
      listForUser: vi.fn(),
      linkResource: vi.fn(),
      listLinkedResourcesForUser,
    };

    const useCase = new ListGoalLinkedResourcesUseCase(goals);
    const result = await useCase.execute({ userId: "user-1" });

    expect(result).toEqual({ ok: true, value: linked });
    expect(listLinkedResourcesForUser).toHaveBeenCalledWith("user-1");
  });
});
