import type { UserResourceRow } from "#/modules/library/adapters/schemas/user-resource-row.schema";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";

export function mapUserResourceRow(row: UserResourceRow): SavedUserResource {
  return {
    id: row.id,
    userId: row.user_id,
    resourceId: row.resource_id,
    status: row.status,
    progressPercentage: row.progress_percentage,
    notes: row.notes,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
