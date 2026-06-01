import type { UserResourceStatus } from "#/modules/library/domain/entities/user-resource";

export type UpdateUserResourceQuery = {
  sql: string;
  bindings: {
    status: UserResourceStatus;
    progressPercentage: number;
    startedAt: string | null;
    completedAt: string | null;
    updatedAt: string;
    userId: string;
    resourceId: string;
  };
};

export function buildUpdateUserResourceQuery(
  userId: string,
  resourceId: string,
  status: UserResourceStatus,
  progressPercentage: number,
  startedAt: string | null,
  completedAt: string | null,
  now: string,
): UpdateUserResourceQuery {
  return {
    sql: `
      UPDATE user_resources
      SET
        status = ?,
        progress_percentage = ?,
        started_at = ?,
        completed_at = ?,
        updated_at = ?
      WHERE user_id = ? AND resource_id = ?
    `.trim(),
    bindings: {
      status,
      progressPercentage,
      startedAt,
      completedAt,
      updatedAt: now,
      userId,
      resourceId,
    },
  };
}
