import {
  buildUpsertAppUserQuery,
  selectAppUserByAuthUserIdSql,
} from "#/modules/identity/adapters/d1/build-upsert-app-user-query";
import { invalidRowError, mapD1Error } from "#/modules/identity/adapters/errors/map-d1-error";
import { mapAppUserRow } from "#/modules/identity/adapters/mappers/map-app-user-row";
import { appUserRowSchema } from "#/modules/identity/adapters/schemas/app-user-row.schema";
import type { AuthUserSnapshot } from "#/modules/identity/domain/entities/app-user";
import type { AppUser } from "#/modules/identity/domain/entities/app-user";
import type { IdentityError } from "#/modules/identity/domain/errors/identity-errors";
import type { AppUserPort } from "#/modules/identity/domain/ports/app-user-port";
import { err, ok, type Result } from "#/shared/domain/result";

async function fetchAppUserByAuthUserId(
  db: D1Database,
  authUserId: string,
): Promise<Result<AppUser, IdentityError>> {
  try {
    const row = await db.prepare(selectAppUserByAuthUserIdSql).bind(authUserId).first<unknown>();

    if (!row) {
      return err(invalidRowError("app_users row missing after upsert"));
    }

    const parsed = appUserRowSchema.safeParse(row);
    if (!parsed.success) {
      return err(invalidRowError(parsed.error.message));
    }

    return ok(mapAppUserRow(parsed.data));
  } catch (error) {
    return err(mapD1Error(error));
  }
}

export function createD1AppUserAdapter(db: D1Database): AppUserPort {
  return {
    async upsertFromAuthSnapshot(
      snapshot: AuthUserSnapshot,
    ): Promise<Result<AppUser, IdentityError>> {
      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      const { sql, bindings } = buildUpsertAppUserQuery(snapshot, id, now);

      try {
        await db
          .prepare(sql)
          .bind(
            bindings.id,
            bindings.authUserId,
            bindings.email,
            bindings.displayName,
            bindings.createdAt,
            bindings.updatedAt,
          )
          .run();
      } catch (error) {
        return err(mapD1Error(error));
      }

      return fetchAppUserByAuthUserId(db, snapshot.authUserId);
    },
  };
}
