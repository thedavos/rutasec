import type { UserGoals } from "#/modules/goals/domain/entities/goal";
import type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
import type { Result } from "#/shared/domain/result";

export type ListUserGoalsInput = {
  userId: string;
};

export interface ListUserGoals {
  execute(input: ListUserGoalsInput): Promise<Result<UserGoals, GoalError>>;
}
