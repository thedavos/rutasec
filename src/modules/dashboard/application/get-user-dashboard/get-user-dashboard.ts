import type { UserDashboard } from "#/modules/dashboard/domain/entities/user-dashboard";
import type { DashboardError } from "#/modules/dashboard/domain/errors/dashboard-errors";
import type { Result } from "#/shared/domain/result";

export type GetUserDashboardInput = {
  userId: string;
};

export interface GetUserDashboard {
  execute(input: GetUserDashboardInput): Promise<Result<UserDashboard, DashboardError>>;
}
