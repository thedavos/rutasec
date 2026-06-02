import type { GoalLinkedResourceRow } from "#/modules/goals/adapters/schemas/goal-linked-resource-row.schema";
import type { GoalLinkedResource } from "#/modules/goals/domain/entities/goal-linked-resource";

export function mapGoalLinkedResourceRow(row: GoalLinkedResourceRow): GoalLinkedResource {
  return {
    goalId: row.goal_id,
    resourceId: row.resource_id,
    title: row.title,
    category: row.category,
    level: row.level,
    resourceType: row.resource_type,
    estimatedHours: row.estimated_hours,
    priority: row.priority,
    linkedAt: row.linked_at,
  };
}
