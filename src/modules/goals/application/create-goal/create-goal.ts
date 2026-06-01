import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
import type { Result } from "#/shared/domain/result";

export type CreateGoalInput = {
  userId: string;
  title: string;
  description?: string;
  targetDate?: string;
  hoursPerWeek: number;
};

export interface CreateGoal {
  execute(input: CreateGoalInput): Promise<Result<LearningGoal, GoalError>>;
}
