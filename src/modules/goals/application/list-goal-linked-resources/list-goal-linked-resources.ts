import type { GoalLinkedResource } from "#/modules/goals/domain/entities/goal-linked-resource";
import type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
import type { Result } from "#/shared/domain/result";

export type ListGoalLinkedResourcesInput = {
  userId: string;
};

export interface ListGoalLinkedResources {
  execute(input: ListGoalLinkedResourcesInput): Promise<Result<GoalLinkedResource[], GoalError>>;
}
