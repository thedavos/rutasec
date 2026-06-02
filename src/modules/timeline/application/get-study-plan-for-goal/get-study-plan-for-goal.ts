import type { StudyPlan } from "#/modules/timeline/domain/entities/study-plan";
import type { StudyPlanError } from "#/modules/timeline/domain/errors/study-plan-errors";
import type { Result } from "#/shared/domain/result";

export type GetStudyPlanForGoalInput = {
  userId: string;
  goalId: string;
};

export interface GetStudyPlanForGoal {
  execute(input: GetStudyPlanForGoalInput): Promise<Result<StudyPlan | null, StudyPlanError>>;
}
