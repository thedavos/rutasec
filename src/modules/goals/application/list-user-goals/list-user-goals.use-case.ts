import type {
  ListUserGoals,
  ListUserGoalsInput,
} from "#/modules/goals/application/list-user-goals/list-user-goals";
import type { UserGoals } from "#/modules/goals/domain/entities/goal";
import type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
import type { GoalsPort } from "#/modules/goals/domain/ports/goals-port";
import { ok, type Result } from "#/shared/domain/result";

export class ListUserGoalsUseCase implements ListUserGoals {
  constructor(private readonly goals: GoalsPort) {}

  async execute(input: ListUserGoalsInput): Promise<Result<UserGoals, GoalError>> {
    const listResult = await this.goals.listForUser(input.userId);

    if (!listResult.ok) {
      return listResult;
    }

    return ok({ goals: listResult.value });
  }
}
