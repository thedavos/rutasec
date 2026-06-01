export type LinkGoalResourceQuery = {
  sql: string;
  bindings: {
    goalId: string;
    resourceId: string;
    createdAt: string;
    userId: string;
  };
};

export function buildLinkGoalResourceQuery(
  goalId: string,
  resourceId: string,
  userId: string,
  createdAt: string,
): LinkGoalResourceQuery {
  const sql = `
    INSERT OR IGNORE INTO goal_resources (goal_id, resource_id, priority, created_at)
    SELECT ?, ?, 0, ?
    WHERE EXISTS (SELECT 1 FROM goals WHERE id = ? AND user_id = ?)
      AND EXISTS (
        SELECT 1 FROM user_resources WHERE user_id = ? AND resource_id = ?
      )
  `.trim();

  return {
    sql,
    bindings: {
      goalId,
      resourceId,
      createdAt,
      userId,
    },
  };
}

export type GoalResourceLinkExistsQuery = {
  sql: string;
  bindings: {
    goalId: string;
    resourceId: string;
    userId: string;
  };
};

export function buildGoalResourceLinkExistsQuery(
  goalId: string,
  resourceId: string,
  userId: string,
): GoalResourceLinkExistsQuery {
  const sql = `
    SELECT 1 AS exists_flag
    FROM goal_resources gr
    INNER JOIN goals g ON g.id = gr.goal_id
    WHERE gr.goal_id = ? AND gr.resource_id = ? AND g.user_id = ?
    LIMIT 1
  `.trim();

  return {
    sql,
    bindings: { goalId, resourceId, userId },
  };
}

export type GoalOwnedByUserQuery = {
  sql: string;
  bindings: { goalId: string; userId: string };
};

export function buildGoalOwnedByUserQuery(goalId: string, userId: string): GoalOwnedByUserQuery {
  const sql = `
    SELECT 1 AS exists_flag
    FROM goals
    WHERE id = ? AND user_id = ?
    LIMIT 1
  `.trim();

  return {
    sql,
    bindings: { goalId, userId },
  };
}
