export { createGoalFn } from "#/modules/goals/server/create-goal";
export { listUserGoalsFn } from "#/modules/goals/server/list-user-goals";
export type { CreateGoalInput } from "#/modules/goals/server/create-goal";

export type { GoalsPort } from "#/modules/goals/domain/ports/goals-port";
export type {
  CreateGoal,
  CreateGoalInput as CreateGoalUseCaseInput,
  ListUserGoals,
  ListUserGoalsInput,
} from "#/modules/goals/application";
export type { GoalStatus, LearningGoal, UserGoals } from "#/modules/goals/domain/entities/goal";
export { GOAL_STATUSES } from "#/modules/goals/domain/entities/goal";
export type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
