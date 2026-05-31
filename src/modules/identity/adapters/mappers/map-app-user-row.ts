import type { AppUserRow } from "#/modules/identity/adapters/schemas/app-user-row.schema";
import type { AppUser } from "#/modules/identity/domain/entities/app-user";

export function mapAppUserRow(row: AppUserRow): AppUser {
  return {
    id: row.id,
    authUserId: row.auth_user_id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
