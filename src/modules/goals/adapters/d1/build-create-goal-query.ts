export type CreateGoalQuery = {
  sql: string;
  bindings: {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    targetDate: string | null;
    hoursPerWeek: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type SelectGoalByIdQuery = {
  sql: string;
  bindings: {
    id: string;
    userId: string;
  };
};

export function buildCreateGoalQuery(
  id: string,
  userId: string,
  title: string,
  description: string | null,
  targetDate: string | null,
  hoursPerWeek: number,
  now: string,
): CreateGoalQuery {
  return {
    sql: `
      INSERT INTO goals (
        id,
        user_id,
        title,
        description,
        target_date,
        hours_per_week,
        status,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `.trim(),
    bindings: {
      id,
      userId,
      title,
      description,
      targetDate,
      hoursPerWeek,
      createdAt: now,
      updatedAt: now,
    },
  };
}

export function buildSelectGoalByIdQuery(id: string, userId: string): SelectGoalByIdQuery {
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
      WHERE id = ? AND user_id = ?
    `.trim(),
    bindings: {
      id,
      userId,
    },
  };
}
