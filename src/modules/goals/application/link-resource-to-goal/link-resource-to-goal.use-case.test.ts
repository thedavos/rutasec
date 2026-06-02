import { describe, expect, it, vi } from "vite-plus/test";

import { LinkResourceToGoalUseCase } from "#/modules/goals/application/link-resource-to-goal/link-resource-to-goal.use-case";
import type { GoalsPort } from "#/modules/goals/domain/ports/goals-port";
import { ok } from "#/shared/domain/result";

describe("LinkResourceToGoalUseCase", () => {
  it("delegates to GoalsPort.linkResource", async () => {
    const linkResource = vi.fn().mockResolvedValue(ok(undefined));
    const goals: GoalsPort = {
      createForUser: vi.fn(),
      getByIdForUser: vi.fn(),
      listForUser: vi.fn(),
      linkResource,
      listLinkedResourcesForUser: vi.fn(),
    };

    const useCase = new LinkResourceToGoalUseCase(goals);
    const result = await useCase.execute({
      userId: "user-1",
      goalId: "goal-1",
      resourceId: "res-1",
    });

    expect(result).toEqual({ ok: true, value: undefined });
    expect(linkResource).toHaveBeenCalledWith({
      userId: "user-1",
      goalId: "goal-1",
      resourceId: "res-1",
    });
  });
});
