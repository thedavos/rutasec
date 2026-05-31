export type SaveUserResourceQuery = {
  sql: string;
  bindings: {
    id: string;
    userId: string;
    resourceId: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type SelectUserResourceQuery = {
  sql: string;
  bindings: {
    userId: string;
    resourceId: string;
  };
};

export function buildSaveUserResourceQuery(
  userId: string,
  resourceId: string,
  id: string,
  now: string,
): SaveUserResourceQuery {
  return {
    sql: `
      INSERT INTO user_resources (
        id,
        user_id,
        resource_id,
        status,
        progress_percentage,
        notes,
        started_at,
        completed_at,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, 'pending', 0, NULL, NULL, NULL, ?, ?)
      ON CONFLICT(user_id, resource_id) DO NOTHING
    `.trim(),
    bindings: {
      id,
      userId,
      resourceId,
      createdAt: now,
      updatedAt: now,
    },
  };
}

export function buildSelectUserResourceQuery(
  userId: string,
  resourceId: string,
): SelectUserResourceQuery {
  return {
    sql: `
      SELECT
        id,
        user_id,
        resource_id,
        status,
        progress_percentage,
        notes,
        started_at,
        completed_at,
        created_at,
        updated_at
      FROM user_resources
      WHERE user_id = ? AND resource_id = ?
    `.trim(),
    bindings: {
      userId,
      resourceId,
    },
  };
}
