import type {
  StudyPlanDraft,
  TimelinePlanningInput,
} from "#/modules/timeline/domain/entities/study-plan-draft";
import type { TimelineError } from "#/modules/timeline/domain/errors/timeline-errors";
import type { Result } from "#/shared/domain/result";

export type BuildStudyPlanDraftInput = TimelinePlanningInput;

export interface BuildStudyPlanDraft {
  execute(input: BuildStudyPlanDraftInput): Result<StudyPlanDraft, TimelineError>;
}
