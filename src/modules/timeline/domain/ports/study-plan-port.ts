import type { StudyPlanDraft } from "#/modules/timeline/domain/entities/study-plan-draft";
import type { StudyPlan } from "#/modules/timeline/domain/entities/study-plan";
import type { StudyPlanError } from "#/modules/timeline/domain/errors/study-plan-errors";
import type { Result } from "#/shared/domain/result";

export type ReplaceGeneratedPlanInput = {
  userId: string;
  goalId: string;
  title: string;
  draft: StudyPlanDraft;
};

export type GetActiveStudyPlanInput = {
  userId: string;
  goalId: string;
};

export interface StudyPlanPort {
  replaceGeneratedPlan(
    input: ReplaceGeneratedPlanInput,
  ): Promise<Result<StudyPlan, StudyPlanError>>;
  getActiveByGoalForUser(
    input: GetActiveStudyPlanInput,
  ): Promise<Result<StudyPlan | null, StudyPlanError>>;
}
