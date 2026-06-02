import type {
  GetStudyPlanForGoal,
  GetStudyPlanForGoalInput,
} from "#/modules/timeline/application/get-study-plan-for-goal/get-study-plan-for-goal";
import type { StudyPlan } from "#/modules/timeline/domain/entities/study-plan";
import type { StudyPlanError } from "#/modules/timeline/domain/errors/study-plan-errors";
import type { StudyPlanPort } from "#/modules/timeline/domain/ports/study-plan-port";
import type { Result } from "#/shared/domain/result";

export class GetStudyPlanForGoalUseCase implements GetStudyPlanForGoal {
  constructor(private readonly studyPlans: StudyPlanPort) {}

  async execute(
    input: GetStudyPlanForGoalInput,
  ): Promise<Result<StudyPlan | null, StudyPlanError>> {
    return this.studyPlans.getActiveByGoalForUser({
      userId: input.userId,
      goalId: input.goalId,
    });
  }
}
