export type InsertStudyPlanQuery = {
  sql: string;
  bindings: {
    id: string;
    userId: string;
    goalId: string;
    title: string;
    totalEstimatedHours: number;
    estimatedWeeks: number;
    createdAt: string;
    updatedAt: string;
  };
};

export function buildInsertStudyPlanQuery(
  id: string,
  userId: string,
  goalId: string,
  title: string,
  totalEstimatedHours: number,
  estimatedWeeks: number,
  createdAt: string,
): InsertStudyPlanQuery {
  return {
    sql: `
      INSERT INTO study_plans (
        id,
        user_id,
        goal_id,
        title,
        total_estimated_hours,
        estimated_weeks,
        status,
        generated_by,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'active', 'system', ?, ?)
    `.trim(),
    bindings: {
      id,
      userId,
      goalId,
      title,
      totalEstimatedHours,
      estimatedWeeks,
      createdAt,
      updatedAt: createdAt,
    },
  };
}
