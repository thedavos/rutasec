import type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
import type { Result } from "#/shared/domain/result";

export type LinkResourceToGoalInput = {
  userId: string;
  goalId: string;
  resourceId: string;
};

export interface LinkResourceToGoal {
  execute(input: LinkResourceToGoalInput): Promise<Result<void, GoalError>>;
}
