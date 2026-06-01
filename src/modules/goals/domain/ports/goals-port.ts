import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
import type { Result } from "#/shared/domain/result";

export type CreateGoalForUserInput = {
  userId: string;
  title: string;
  description?: string;
  targetDate?: string;
  hoursPerWeek: number;
};

export interface GoalsPort {
  createForUser(input: CreateGoalForUserInput): Promise<Result<LearningGoal, GoalError>>;
  listForUser(userId: string): Promise<Result<LearningGoal[], GoalError>>;
}
