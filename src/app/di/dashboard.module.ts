import { createGoalsModule } from "#/app/di/goals.module";
import { createLibraryModule } from "#/app/di/library.module";
import { GetUserDashboardUseCase } from "#/modules/dashboard/application";
import { getDb } from "#/shared/db";

export type DashboardModule = {
  getUserDashboard: GetUserDashboardUseCase;
};

export function createDashboardModule(db: D1Database): DashboardModule {
  const goalsModule = createGoalsModule(db);
  const libraryModule = createLibraryModule(db);

  return {
    getUserDashboard: new GetUserDashboardUseCase(
      goalsModule.listUserGoals,
      libraryModule.getPersonalLibrary,
      goalsModule.listGoalLinkedResources,
    ),
  };
}

export function getDashboardModule(): DashboardModule {
  return createDashboardModule(getDb());
}
