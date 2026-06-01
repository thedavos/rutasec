import { createD1GoalsAdapter } from "#/modules/goals/adapters/d1/d1-goals-adapter";
import {
  CreateGoalUseCase,
  LinkResourceToGoalUseCase,
  ListGoalLinkedResourcesUseCase,
  ListUserGoalsUseCase,
} from "#/modules/goals/application";
import { getDb } from "#/shared/db";

export type GoalsModule = {
  createGoal: CreateGoalUseCase;
  listUserGoals: ListUserGoalsUseCase;
  linkResourceToGoal: LinkResourceToGoalUseCase;
  listGoalLinkedResources: ListGoalLinkedResourcesUseCase;
};

export function createGoalsModule(db: D1Database): GoalsModule {
  const goals = createD1GoalsAdapter(db);

  return {
    createGoal: new CreateGoalUseCase(goals),
    listUserGoals: new ListUserGoalsUseCase(goals),
    linkResourceToGoal: new LinkResourceToGoalUseCase(goals),
    listGoalLinkedResources: new ListGoalLinkedResourcesUseCase(goals),
  };
}

export function getGoalsModule(): GoalsModule {
  return createGoalsModule(getDb());
}
