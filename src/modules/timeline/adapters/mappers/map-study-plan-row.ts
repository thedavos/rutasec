import type { StudyPlanItemRow } from "#/modules/timeline/adapters/schemas/study-plan-item-row.schema";
import type { StudyPlanRow } from "#/modules/timeline/adapters/schemas/study-plan-row.schema";
import type { StudyPlan, StudyPlanItem } from "#/modules/timeline/domain/entities/study-plan";

export function mapStudyPlanItemRow(row: StudyPlanItemRow): StudyPlanItem {
  return {
    id: row.id,
    studyPlanId: row.study_plan_id,
    resourceId: row.resource_id,
    itemOrder: row.item_order,
    weekNumber: row.week_number,
    status: row.status,
    estimatedStartDate: row.estimated_start_date,
    estimatedEndDate: row.estimated_end_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapStudyPlanRow(row: StudyPlanRow, items: StudyPlanItem[]): StudyPlan {
  return {
    id: row.id,
    userId: row.user_id,
    goalId: row.goal_id,
    title: row.title,
    totalEstimatedHours: row.total_estimated_hours,
    estimatedWeeks: row.estimated_weeks,
    status: row.status,
    generatedBy: row.generated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items,
  };
}
