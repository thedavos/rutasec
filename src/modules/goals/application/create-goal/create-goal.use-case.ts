import type {
  CreateGoal,
  CreateGoalInput,
} from "#/modules/goals/application/create-goal/create-goal";
import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
import type { GoalsPort } from "#/modules/goals/domain/ports/goals-port";
import type { Result } from "#/shared/domain/result";

export class CreateGoalUseCase implements CreateGoal {
  constructor(private readonly goals: GoalsPort) {}

  async execute(input: CreateGoalInput): Promise<Result<LearningGoal, GoalError>> {
    return this.goals.createForUser({
      userId: input.userId,
      title: input.title,
      description: input.description,
      targetDate: input.targetDate,
      hoursPerWeek: input.hoursPerWeek,
    });
  }
}
