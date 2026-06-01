import type { GoalError } from "#/modules/goals/domain/errors/goal-errors";

export function mapD1Error(error: unknown): GoalError {
  const message = error instanceof Error ? error.message : "D1 query failed";
  return { type: "query_failed", message };
}

export function invalidRowError(message: string): GoalError {
  return { type: "invalid_row", message };
}
