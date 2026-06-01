export { createGoalFn } from "#/modules/goals/server/create-goal";
export { linkResourceToGoalFn } from "#/modules/goals/server/link-resource-to-goal";
export { listGoalLinkedResourcesFn } from "#/modules/goals/server/list-goal-linked-resources";
export { listUserGoalsFn } from "#/modules/goals/server/list-user-goals";
export type { CreateGoalInput } from "#/modules/goals/server/create-goal";
export type { LinkResourceToGoalInput } from "#/modules/goals/server/link-resource-to-goal";

export type { GoalsPort } from "#/modules/goals/domain/ports/goals-port";
export type {
  CreateGoal,
  CreateGoalInput as CreateGoalUseCaseInput,
  LinkResourceToGoal,
  LinkResourceToGoalInput as LinkResourceToGoalUseCaseInput,
  ListGoalLinkedResources,
  ListGoalLinkedResourcesInput,
  ListUserGoals,
  ListUserGoalsInput,
} from "#/modules/goals/application";
export type { GoalLinkedResource } from "#/modules/goals/domain/entities/goal-linked-resource";
export type { GoalStatus, LearningGoal, UserGoals } from "#/modules/goals/domain/entities/goal";
export { GOAL_STATUSES } from "#/modules/goals/domain/entities/goal";
export type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
