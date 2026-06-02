import type { StudyPlan } from "#/modules/timeline/domain/entities/study-plan";
import type { StudyPlanError } from "#/modules/timeline/domain/errors/study-plan-errors";
import type { Result } from "#/shared/domain/result";

export type GenerateStudyPlanForGoalInput = {
  userId: string;
  goalId: string;
};

export interface GenerateStudyPlanForGoal {
  execute(input: GenerateStudyPlanForGoalInput): Promise<Result<StudyPlan, StudyPlanError>>;
}
