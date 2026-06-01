import type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
import { goalErrorMessage } from "#/modules/goals/domain/errors/goal-errors";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import { libraryErrorMessage } from "#/modules/library/domain/errors/library-errors";

export type DashboardError = GoalError | LibraryError;

export function dashboardErrorMessage(error: DashboardError): string {
  if (error.type === "goal_not_found" || error.type === "resource_not_in_library") {
    return goalErrorMessage(error);
  }

  return libraryErrorMessage(error as LibraryError);
}
