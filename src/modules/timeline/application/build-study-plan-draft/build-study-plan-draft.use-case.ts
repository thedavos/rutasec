import { computeStudyPlanDraft } from "#/modules/timeline/application/build-study-plan-draft/compute-study-plan-draft";
import type {
  BuildStudyPlanDraft,
  BuildStudyPlanDraftInput,
} from "#/modules/timeline/application/build-study-plan-draft/build-study-plan-draft";
import type { StudyPlanDraft } from "#/modules/timeline/domain/entities/study-plan-draft";
import type { TimelineError } from "#/modules/timeline/domain/errors/timeline-errors";
import type { Result } from "#/shared/domain/result";

export class BuildStudyPlanDraftUseCase implements BuildStudyPlanDraft {
  execute(input: BuildStudyPlanDraftInput): Result<StudyPlanDraft, TimelineError> {
    return computeStudyPlanDraft(input);
  }
}
