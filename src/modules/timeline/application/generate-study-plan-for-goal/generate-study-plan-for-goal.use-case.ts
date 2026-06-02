import { buildTimelinePlanningInput } from "#/modules/timeline/application/build-timeline-planning-input";
import type { BuildStudyPlanDraft } from "#/modules/timeline/application/build-study-plan-draft/build-study-plan-draft";
import {
  mapGoalErrorToStudyPlanError,
  mapLibraryErrorToStudyPlanError,
} from "#/modules/timeline/application/generate-study-plan-for-goal/map-external-errors";
import type {
  GenerateStudyPlanForGoal,
  GenerateStudyPlanForGoalInput,
} from "#/modules/timeline/application/generate-study-plan-for-goal/generate-study-plan-for-goal";
import type { StudyPlan } from "#/modules/timeline/domain/entities/study-plan";
import type { StudyPlanError } from "#/modules/timeline/domain/errors/study-plan-errors";
import type { StudyPlanPort } from "#/modules/timeline/domain/ports/study-plan-port";
import type { GoalsPort } from "#/modules/goals/domain/ports/goals-port";
import type { GetPersonalLibrary } from "#/modules/library/application/get-personal-library/get-personal-library";
import { err, type Result } from "#/shared/domain/result";

export class GenerateStudyPlanForGoalUseCase implements GenerateStudyPlanForGoal {
  constructor(
    private readonly goals: GoalsPort,
    private readonly getPersonalLibrary: GetPersonalLibrary,
    private readonly buildStudyPlanDraft: BuildStudyPlanDraft,
    private readonly studyPlans: StudyPlanPort,
  ) {}

  async execute(input: GenerateStudyPlanForGoalInput): Promise<Result<StudyPlan, StudyPlanError>> {
    const goalResult = await this.goals.getByIdForUser(input.userId, input.goalId);
    if (!goalResult.ok) {
      return err(mapGoalErrorToStudyPlanError(goalResult.error));
    }

    const [linkedResult, libraryResult] = await Promise.all([
      this.goals.listLinkedResourcesForUser(input.userId),
      this.getPersonalLibrary.execute({ userId: input.userId }),
    ]);

    if (!linkedResult.ok) {
      return err(mapGoalErrorToStudyPlanError(linkedResult.error));
    }

    if (!libraryResult.ok) {
      return err(mapLibraryErrorToStudyPlanError(libraryResult.error));
    }

    const planningInput = buildTimelinePlanningInput(
      goalResult.value,
      linkedResult.value,
      libraryResult.value.items,
    );
    if (!planningInput.ok) {
      return planningInput;
    }

    const draftResult = this.buildStudyPlanDraft.execute(planningInput.value);
    if (!draftResult.ok) {
      if (draftResult.error.type === "invalid_hours_per_week") {
        return err({ type: "invalid_hours_per_week" });
      }
      return err({ type: "query_failed", message: "Failed to build study plan draft." });
    }

    return this.studyPlans.replaceGeneratedPlan({
      userId: input.userId,
      goalId: input.goalId,
      title: `${goalResult.value.title} study plan`,
      draft: draftResult.value,
    });
  }
}
