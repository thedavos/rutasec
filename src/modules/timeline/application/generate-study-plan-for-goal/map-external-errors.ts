import { goalErrorMessage, type GoalError } from "#/modules/goals/domain/errors/goal-errors";
import {
  libraryErrorMessage,
  type LibraryError,
} from "#/modules/library/domain/errors/library-errors";
import type { StudyPlanError } from "#/modules/timeline/domain/errors/study-plan-errors";

export function mapGoalErrorToStudyPlanError(error: GoalError): StudyPlanError {
  if (error.type === "goal_not_found") {
    return { type: "goal_not_found", message: error.message };
  }

  return { type: "query_failed", message: goalErrorMessage(error) };
}

export function mapLibraryErrorToStudyPlanError(error: LibraryError): StudyPlanError {
  return { type: "query_failed", message: libraryErrorMessage(error) };
}
