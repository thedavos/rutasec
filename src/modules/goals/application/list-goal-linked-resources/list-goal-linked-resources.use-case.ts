import type {
  ListGoalLinkedResources,
  ListGoalLinkedResourcesInput,
} from "#/modules/goals/application/list-goal-linked-resources/list-goal-linked-resources";
import type { GoalLinkedResource } from "#/modules/goals/domain/entities/goal-linked-resource";
import type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
import type { GoalsPort } from "#/modules/goals/domain/ports/goals-port";
import type { Result } from "#/shared/domain/result";

export class ListGoalLinkedResourcesUseCase implements ListGoalLinkedResources {
  constructor(private readonly goals: GoalsPort) {}

  async execute(
    input: ListGoalLinkedResourcesInput,
  ): Promise<Result<GoalLinkedResource[], GoalError>> {
    return this.goals.listLinkedResourcesForUser(input.userId);
  }
}
