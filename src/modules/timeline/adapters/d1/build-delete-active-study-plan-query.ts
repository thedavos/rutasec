export type DeleteActiveStudyPlanQuery = {
  sql: string;
  bindings: {
    userId: string;
    goalId: string;
  };
};

export function buildDeleteActiveStudyPlanQuery(
  userId: string,
  goalId: string,
): DeleteActiveStudyPlanQuery {
  return {
    sql: `
      DELETE FROM study_plans
      WHERE user_id = ? AND goal_id = ? AND status = 'active'
    `.trim(),
    bindings: { userId, goalId },
  };
}
