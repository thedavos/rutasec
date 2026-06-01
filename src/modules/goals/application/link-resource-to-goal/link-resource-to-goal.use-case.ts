import type {
  LinkResourceToGoal,
  LinkResourceToGoalInput,
} from "#/modules/goals/application/link-resource-to-goal/link-resource-to-goal";
import type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
import type { GoalsPort } from "#/modules/goals/domain/ports/goals-port";
import type { Result } from "#/shared/domain/result";

export class LinkResourceToGoalUseCase implements LinkResourceToGoal {
  constructor(private readonly goals: GoalsPort) {}

  async execute(input: LinkResourceToGoalInput): Promise<Result<void, GoalError>> {
    return this.goals.linkResource({
      userId: input.userId,
      goalId: input.goalId,
      resourceId: input.resourceId,
    });
  }
}
