import {
  buildSaveUserResourceQuery,
  buildSelectUserResourceQuery,
} from "#/modules/library/adapters/d1/build-save-user-resource-query";
import { invalidRowError, mapD1Error } from "#/modules/library/adapters/errors/map-d1-error";
import { mapUserResourceRow } from "#/modules/library/adapters/mappers/map-user-resource-row";
import { userResourceRowSchema } from "#/modules/library/adapters/schemas/user-resource-row.schema";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import type { LibraryError } from "#/modules/library/domain/errors/library-errors";
import type {
  LibraryPort,
  UserResourceLookupInput,
} from "#/modules/library/domain/ports/library-port";
import { err, ok, type Result } from "#/shared/domain/result";

async function selectForUser(
  db: D1Database,
  userId: string,
  resourceId: string,
  options: { missingRowError: LibraryError | null },
): Promise<Result<SavedUserResource | null, LibraryError>> {
  const { sql, bindings } = buildSelectUserResourceQuery(userId, resourceId);

  try {
    const row = await db.prepare(sql).bind(bindings.userId, bindings.resourceId).first<unknown>();

    if (!row) {
      return options.missingRowError ? err(options.missingRowError) : ok(null);
    }

    const parsed = userResourceRowSchema.safeParse(row);
    if (!parsed.success) {
      return err(invalidRowError(parsed.error.message));
    }

    return ok(mapUserResourceRow(parsed.data));
  } catch (error) {
    return err(mapD1Error(error));
  }
}

export function createD1LibraryAdapter(db: D1Database): LibraryPort {
  return {
    async getForUser(
      input: UserResourceLookupInput,
    ): Promise<Result<SavedUserResource | null, LibraryError>> {
      return selectForUser(db, input.userId, input.resourceId, { missingRowError: null });
    },

    async saveForUser(
      input: UserResourceLookupInput,
    ): Promise<Result<SavedUserResource, LibraryError>> {
      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      const { sql, bindings } = buildSaveUserResourceQuery(input.userId, input.resourceId, id, now);

      try {
        await db
          .prepare(sql)
          .bind(
            bindings.id,
            bindings.userId,
            bindings.resourceId,
            bindings.createdAt,
            bindings.updatedAt,
          )
          .run();
      } catch (error) {
        return err(mapD1Error(error));
      }

      const result = await selectForUser(db, input.userId, input.resourceId, {
        missingRowError: invalidRowError("user_resources row missing after save"),
      });

      if (!result.ok) {
        return result;
      }

      if (result.value === null) {
        return err(invalidRowError("user_resources row missing after save"));
      }

      return ok(result.value);
    },
  };
}
