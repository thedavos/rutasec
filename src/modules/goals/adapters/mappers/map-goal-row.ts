import type { GoalRow } from "#/modules/goals/adapters/schemas/goal-row.schema";
import type { LearningGoal } from "#/modules/goals/domain/entities/goal";

export function mapGoalRow(row: GoalRow): LearningGoal {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    targetDate: row.target_date,
    hoursPerWeek: row.hours_per_week,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
