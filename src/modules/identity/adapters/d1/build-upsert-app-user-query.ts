import type { AuthUserSnapshot } from "#/modules/identity/domain/entities/app-user";

export type UpsertAppUserQuery = {
  sql: string;
  bindings: {
    id: string;
    authUserId: string;
    email: string;
    displayName: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export function buildUpsertAppUserQuery(
  snapshot: AuthUserSnapshot,
  id: string,
  now: string,
): UpsertAppUserQuery {
  return {
    sql: `
      INSERT INTO app_users (id, auth_user_id, email, display_name, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'user', ?, ?)
      ON CONFLICT(auth_user_id) DO UPDATE SET
        email = excluded.email,
        display_name = excluded.display_name,
        updated_at = excluded.updated_at
    `.trim(),
    bindings: {
      id,
      authUserId: snapshot.authUserId,
      email: snapshot.email,
      displayName: snapshot.displayName,
      createdAt: now,
      updatedAt: now,
    },
  };
}

export const selectAppUserByAuthUserIdSql = `
  SELECT id, auth_user_id, email, display_name, role, created_at, updated_at
  FROM app_users
  WHERE auth_user_id = ?
`.trim();
