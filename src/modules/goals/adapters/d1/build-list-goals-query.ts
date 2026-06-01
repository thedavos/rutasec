export type ListGoalsQuery = {
  sql: string;
  bindings: {
    userId: string;
  };
};

export function buildListGoalsQuery(userId: string): ListGoalsQuery {
  return {
    sql: `
      SELECT
        id,
        user_id,
        title,
        description,
        target_date,
        hours_per_week,
        status,
        created_at,
        updated_at
      FROM goals
      WHERE user_id = ?
      ORDER BY created_at DESC
    `.trim(),
    bindings: {
      userId,
    },
  };
}
