import { createD1GoalsAdapter } from "#/modules/goals/adapters/d1/d1-goals-adapter";
import { CreateGoalUseCase, ListUserGoalsUseCase } from "#/modules/goals/application";
import { getDb } from "#/shared/db";

export type GoalsModule = {
  createGoal: CreateGoalUseCase;
  listUserGoals: ListUserGoalsUseCase;
};

export function createGoalsModule(db: D1Database): GoalsModule {
  const goals = createD1GoalsAdapter(db);

  return {
    createGoal: new CreateGoalUseCase(goals),
    listUserGoals: new ListUserGoalsUseCase(goals),
  };
}

export function getGoalsModule(): GoalsModule {
  return createGoalsModule(getDb());
}
