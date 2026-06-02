export { generateStudyPlanForGoalFn } from "#/modules/timeline/server/generate-study-plan-for-goal";
export { getStudyPlanForGoalFn } from "#/modules/timeline/server/get-study-plan-for-goal";
export type { GenerateStudyPlanForGoalInput } from "#/modules/timeline/server/generate-study-plan-for-goal";
export type { GetStudyPlanForGoalServerInput } from "#/modules/timeline/server/get-study-plan-for-goal";

export type {
  GenerateStudyPlanForGoal,
  GenerateStudyPlanForGoalInput as GenerateStudyPlanForGoalUseCaseInput,
  GetStudyPlanForGoal,
  GetStudyPlanForGoalInput,
} from "#/modules/timeline/application";
export type {
  BuildStudyPlanDraft,
  BuildStudyPlanDraftInput,
} from "#/modules/timeline/application/build-study-plan-draft/build-study-plan-draft";
export { BuildStudyPlanDraftUseCase } from "#/modules/timeline/application/build-study-plan-draft/build-study-plan-draft.use-case";
export { computeStudyPlanDraft } from "#/modules/timeline/application/build-study-plan-draft/compute-study-plan-draft";
export type {
  StudyPlanDraft,
  StudyPlanItemDraft,
  StudyPlanItemStatus,
  TimelinePlanningInput,
  TimelineResourceInput,
} from "#/modules/timeline/domain/entities/study-plan-draft";
export type { StudyPlan, StudyPlanItem } from "#/modules/timeline/domain/entities/study-plan";
export type { TimelineError } from "#/modules/timeline/domain/errors/timeline-errors";
export type { StudyPlanError } from "#/modules/timeline/domain/errors/study-plan-errors";
export {
  invalidHoursPerWeekError,
  timelineErrorMessage,
} from "#/modules/timeline/domain/errors/timeline-errors";
export { studyPlanErrorMessage } from "#/modules/timeline/domain/errors/study-plan-errors";
