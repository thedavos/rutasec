import { computeUserDashboard } from "#/modules/dashboard/application/get-user-dashboard/compute-user-dashboard";
import type {
  GetUserDashboard,
  GetUserDashboardInput,
} from "#/modules/dashboard/application/get-user-dashboard/get-user-dashboard";
import type { UserDashboard } from "#/modules/dashboard/domain/entities/user-dashboard";
import type { DashboardError } from "#/modules/dashboard/domain/errors/dashboard-errors";
import type { ListGoalLinkedResources } from "#/modules/goals/application/list-goal-linked-resources/list-goal-linked-resources";
import type { ListUserGoals } from "#/modules/goals/application/list-user-goals/list-user-goals";
import type { GetPersonalLibrary } from "#/modules/library/application/get-personal-library/get-personal-library";
import { ok, type Result } from "#/shared/domain/result";

export class GetUserDashboardUseCase implements GetUserDashboard {
  constructor(
    private readonly listUserGoals: ListUserGoals,
    private readonly getPersonalLibrary: GetPersonalLibrary,
    private readonly listGoalLinkedResources: ListGoalLinkedResources,
  ) {}

  async execute(input: GetUserDashboardInput): Promise<Result<UserDashboard, DashboardError>> {
    const [goalsResult, libraryResult, linkedResult] = await Promise.all([
      this.listUserGoals.execute({ userId: input.userId }),
      this.getPersonalLibrary.execute({ userId: input.userId }),
      this.listGoalLinkedResources.execute({ userId: input.userId }),
    ]);

    if (!goalsResult.ok) {
      return goalsResult;
    }

    if (!libraryResult.ok) {
      return libraryResult;
    }

    if (!linkedResult.ok) {
      return linkedResult;
    }

    return ok(
      computeUserDashboard({
        goals: goalsResult.value.goals,
        libraryItems: libraryResult.value.items,
        linkedResources: linkedResult.value,
      }),
    );
  }
}
