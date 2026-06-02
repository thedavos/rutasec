import { buildDeleteActiveStudyPlanQuery } from "#/modules/timeline/adapters/d1/build-delete-active-study-plan-query";
import { buildInsertStudyPlanItemQuery } from "#/modules/timeline/adapters/d1/build-insert-study-plan-item-query";
import { buildInsertStudyPlanQuery } from "#/modules/timeline/adapters/d1/build-insert-study-plan-query";
import {
  buildSelectActiveStudyPlanByGoalQuery,
  buildSelectStudyPlanItemsQuery,
} from "#/modules/timeline/adapters/d1/build-select-study-plan-by-goal-query";
import { invalidRowError, mapD1Error } from "#/modules/timeline/adapters/errors/map-d1-error";
import {
  mapStudyPlanItemRow,
  mapStudyPlanRow,
} from "#/modules/timeline/adapters/mappers/map-study-plan-row";
import { studyPlanItemRowSchema } from "#/modules/timeline/adapters/schemas/study-plan-item-row.schema";
import { studyPlanRowSchema } from "#/modules/timeline/adapters/schemas/study-plan-row.schema";
import type { StudyPlan } from "#/modules/timeline/domain/entities/study-plan";
import type { StudyPlanError } from "#/modules/timeline/domain/errors/study-plan-errors";
import type {
  GetActiveStudyPlanInput,
  ReplaceGeneratedPlanInput,
  StudyPlanPort,
} from "#/modules/timeline/domain/ports/study-plan-port";
import { err, ok, type Result } from "#/shared/domain/result";

async function loadActivePlan(
  db: D1Database,
  userId: string,
  goalId: string,
): Promise<Result<StudyPlan | null, StudyPlanError>> {
  const planQuery = buildSelectActiveStudyPlanByGoalQuery(userId, goalId);

  try {
    const planRow = await db
      .prepare(planQuery.sql)
      .bind(planQuery.bindings.userId, planQuery.bindings.goalId)
      .first<unknown>();

    if (!planRow) {
      return ok(null);
    }

    const parsedPlan = studyPlanRowSchema.safeParse(planRow);
    if (!parsedPlan.success) {
      return err(invalidRowError(parsedPlan.error.message));
    }

    const itemsQuery = buildSelectStudyPlanItemsQuery(parsedPlan.data.id);
    const itemsResult = await db
      .prepare(itemsQuery.sql)
      .bind(itemsQuery.bindings.studyPlanId)
      .all<unknown>();

    const items = [];
    for (const row of itemsResult.results ?? []) {
      const parsedItem = studyPlanItemRowSchema.safeParse(row);
      if (!parsedItem.success) {
        return err(invalidRowError(parsedItem.error.message));
      }
      items.push(mapStudyPlanItemRow(parsedItem.data));
    }

    return ok(mapStudyPlanRow(parsedPlan.data, items));
  } catch (error) {
    return err(mapD1Error(error));
  }
}

export function createD1StudyPlanAdapter(db: D1Database): StudyPlanPort {
  return {
    async replaceGeneratedPlan(
      input: ReplaceGeneratedPlanInput,
    ): Promise<Result<StudyPlan, StudyPlanError>> {
      const now = new Date().toISOString();
      const planId = crypto.randomUUID();
      const deleteQuery = buildDeleteActiveStudyPlanQuery(input.userId, input.goalId);

      try {
        await db
          .prepare(deleteQuery.sql)
          .bind(deleteQuery.bindings.userId, deleteQuery.bindings.goalId)
          .run();

        const insertPlan = buildInsertStudyPlanQuery(
          planId,
          input.userId,
          input.goalId,
          input.title,
          input.draft.totalEstimatedHours,
          input.draft.estimatedWeeks,
          now,
        );

        await db
          .prepare(insertPlan.sql)
          .bind(
            insertPlan.bindings.id,
            insertPlan.bindings.userId,
            insertPlan.bindings.goalId,
            insertPlan.bindings.title,
            insertPlan.bindings.totalEstimatedHours,
            insertPlan.bindings.estimatedWeeks,
            insertPlan.bindings.createdAt,
            insertPlan.bindings.updatedAt,
          )
          .run();

        for (const item of input.draft.items) {
          const itemId = crypto.randomUUID();
          const insertItem = buildInsertStudyPlanItemQuery(
            itemId,
            planId,
            item.resourceId,
            item.itemOrder,
            item.weekNumber,
            item.status,
            now,
          );

          await db
            .prepare(insertItem.sql)
            .bind(
              insertItem.bindings.id,
              insertItem.bindings.studyPlanId,
              insertItem.bindings.resourceId,
              insertItem.bindings.itemOrder,
              insertItem.bindings.weekNumber,
              insertItem.bindings.status,
              insertItem.bindings.createdAt,
              insertItem.bindings.updatedAt,
            )
            .run();
        }
      } catch (error) {
        return err(mapD1Error(error));
      }

      const loaded = await loadActivePlan(db, input.userId, input.goalId);
      if (!loaded.ok) {
        return loaded;
      }

      if (!loaded.value) {
        return err(invalidRowError("study plan missing after insert"));
      }

      return ok(loaded.value);
    },

    async getActiveByGoalForUser(
      input: GetActiveStudyPlanInput,
    ): Promise<Result<StudyPlan | null, StudyPlanError>> {
      return loadActivePlan(db, input.userId, input.goalId);
    },
  };
}
