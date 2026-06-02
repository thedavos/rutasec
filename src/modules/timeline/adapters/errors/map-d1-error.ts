import type { StudyPlanError } from "#/modules/timeline/domain/errors/study-plan-errors";

export function mapD1Error(error: unknown): StudyPlanError {
  const message = error instanceof Error ? error.message : "D1 query failed";
  return { type: "query_failed", message };
}

export function invalidRowError(message: string): StudyPlanError {
  return { type: "invalid_row", message };
}
