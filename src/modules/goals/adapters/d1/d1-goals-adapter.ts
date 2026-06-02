import {
  buildCreateGoalQuery,
  buildSelectGoalByIdQuery,
} from "#/modules/goals/adapters/d1/build-create-goal-query";
import {
  buildGoalOwnedByUserQuery,
  buildGoalResourceLinkExistsQuery,
  buildLinkGoalResourceQuery,
} from "#/modules/goals/adapters/d1/build-link-goal-resource-query";
import { buildListGoalLinkedResourcesQuery } from "#/modules/goals/adapters/d1/build-list-goal-linked-resources-query";
import { buildListGoalsQuery } from "#/modules/goals/adapters/d1/build-list-goals-query";
import { invalidRowError, mapD1Error } from "#/modules/goals/adapters/errors/map-d1-error";
import { mapGoalLinkedResourceRow } from "#/modules/goals/adapters/mappers/map-goal-linked-resource-row";
import { mapGoalRow } from "#/modules/goals/adapters/mappers/map-goal-row";
import { goalLinkedResourceRowSchema } from "#/modules/goals/adapters/schemas/goal-linked-resource-row.schema";
import { goalRowSchema } from "#/modules/goals/adapters/schemas/goal-row.schema";
import type { GoalLinkedResource } from "#/modules/goals/domain/entities/goal-linked-resource";
import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
import type {
  CreateGoalForUserInput,
  GoalsPort,
  LinkResourceToGoalInput,
} from "#/modules/goals/domain/ports/goals-port";
import { err, ok, type Result } from "#/shared/domain/result";

async function selectById(
  db: D1Database,
  id: string,
  userId: string,
): Promise<Result<LearningGoal, GoalError>> {
  const { sql, bindings } = buildSelectGoalByIdQuery(id, userId);

  try {
    const row = await db.prepare(sql).bind(bindings.id, bindings.userId).first<unknown>();

    if (!row) {
      return err(invalidRowError("goals row missing after insert"));
    }

    const parsed = goalRowSchema.safeParse(row);
    if (!parsed.success) {
      return err(invalidRowError(parsed.error.message));
    }

    return ok(mapGoalRow(parsed.data));
  } catch (error) {
    return err(mapD1Error(error));
  }
}

export function createD1GoalsAdapter(db: D1Database): GoalsPort {
  return {
    async createForUser(input: CreateGoalForUserInput): Promise<Result<LearningGoal, GoalError>> {
      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      const description = input.description?.trim() ? input.description.trim() : null;
      const targetDate = input.targetDate?.trim() ? input.targetDate.trim() : null;
      const { sql, bindings } = buildCreateGoalQuery(
        id,
        input.userId,
        input.title.trim(),
        description,
        targetDate,
        input.hoursPerWeek,
        now,
      );

      try {
        await db
          .prepare(sql)
          .bind(
            bindings.id,
            bindings.userId,
            bindings.title,
            bindings.description,
            bindings.targetDate,
            bindings.hoursPerWeek,
            bindings.createdAt,
            bindings.updatedAt,
          )
          .run();
      } catch (error) {
        return err(mapD1Error(error));
      }

      return selectById(db, id, input.userId);
    },

    async getByIdForUser(userId: string, goalId: string): Promise<Result<LearningGoal, GoalError>> {
      const { sql, bindings } = buildSelectGoalByIdQuery(goalId, userId);

      try {
        const row = await db.prepare(sql).bind(bindings.id, bindings.userId).first<unknown>();

        if (!row) {
          return err({ type: "goal_not_found", message: "Goal not found." });
        }

        const parsed = goalRowSchema.safeParse(row);
        if (!parsed.success) {
          return err(invalidRowError(parsed.error.message));
        }

        return ok(mapGoalRow(parsed.data));
      } catch (error) {
        return err(mapD1Error(error));
      }
    },

    async listForUser(userId: string): Promise<Result<LearningGoal[], GoalError>> {
      const { sql, bindings } = buildListGoalsQuery(userId);

      try {
        const result = await db.prepare(sql).bind(bindings.userId).all<unknown>();

        const goals: LearningGoal[] = [];
        for (const row of result.results ?? []) {
          const parsed = goalRowSchema.safeParse(row);
          if (!parsed.success) {
            return err(invalidRowError(parsed.error.message));
          }
          goals.push(mapGoalRow(parsed.data));
        }

        return ok(goals);
      } catch (error) {
        return err(mapD1Error(error));
      }
    },

    async linkResource(input: LinkResourceToGoalInput): Promise<Result<void, GoalError>> {
      const createdAt = new Date().toISOString();
      const { sql, bindings } = buildLinkGoalResourceQuery(
        input.goalId,
        input.resourceId,
        input.userId,
        createdAt,
      );

      try {
        const insertResult = await db
          .prepare(sql)
          .bind(
            bindings.goalId,
            bindings.resourceId,
            bindings.createdAt,
            bindings.goalId,
            bindings.userId,
            bindings.userId,
            bindings.resourceId,
          )
          .run();

        if ((insertResult.meta.changes ?? 0) > 0) {
          return ok(undefined);
        }

        const existsQuery = buildGoalResourceLinkExistsQuery(
          input.goalId,
          input.resourceId,
          input.userId,
        );
        const existing = await db
          .prepare(existsQuery.sql)
          .bind(
            existsQuery.bindings.goalId,
            existsQuery.bindings.resourceId,
            existsQuery.bindings.userId,
          )
          .first<unknown>();

        if (existing) {
          return ok(undefined);
        }

        const goalQuery = buildGoalOwnedByUserQuery(input.goalId, input.userId);
        const ownedGoal = await db
          .prepare(goalQuery.sql)
          .bind(goalQuery.bindings.goalId, goalQuery.bindings.userId)
          .first<unknown>();

        if (!ownedGoal) {
          return err({ type: "goal_not_found", message: "Goal not found." });
        }

        return err({
          type: "resource_not_in_library",
          message: "Save this resource to your library before linking it to a goal.",
        });
      } catch (error) {
        return err(mapD1Error(error));
      }
    },

    async listLinkedResourcesForUser(
      userId: string,
    ): Promise<Result<GoalLinkedResource[], GoalError>> {
      const { sql, bindings } = buildListGoalLinkedResourcesQuery(userId);

      try {
        const result = await db.prepare(sql).bind(bindings.userId).all<unknown>();
        const linked: GoalLinkedResource[] = [];

        for (const row of result.results ?? []) {
          const parsed = goalLinkedResourceRowSchema.safeParse(row);
          if (!parsed.success) {
            return err(invalidRowError(parsed.error.message));
          }
          linked.push(mapGoalLinkedResourceRow(parsed.data));
        }

        return ok(linked);
      } catch (error) {
        return err(mapD1Error(error));
      }
    },
  };
}
