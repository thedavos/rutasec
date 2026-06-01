import {
  buildCreateGoalQuery,
  buildSelectGoalByIdQuery,
} from "#/modules/goals/adapters/d1/build-create-goal-query";
import { buildListGoalsQuery } from "#/modules/goals/adapters/d1/build-list-goals-query";
import { invalidRowError, mapD1Error } from "#/modules/goals/adapters/errors/map-d1-error";
import { mapGoalRow } from "#/modules/goals/adapters/mappers/map-goal-row";
import { goalRowSchema } from "#/modules/goals/adapters/schemas/goal-row.schema";
import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type { GoalError } from "#/modules/goals/domain/errors/goal-errors";
import type { CreateGoalForUserInput, GoalsPort } from "#/modules/goals/domain/ports/goals-port";
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
  };
}
