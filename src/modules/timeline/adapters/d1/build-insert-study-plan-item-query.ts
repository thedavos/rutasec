export type InsertStudyPlanItemQuery = {
  sql: string;
  bindings: {
    id: string;
    studyPlanId: string;
    resourceId: string;
    itemOrder: number;
    weekNumber: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
};

export function buildInsertStudyPlanItemQuery(
  id: string,
  studyPlanId: string,
  resourceId: string,
  itemOrder: number,
  weekNumber: number,
  status: string,
  createdAt: string,
): InsertStudyPlanItemQuery {
  return {
    sql: `
      INSERT INTO study_plan_items (
        id,
        study_plan_id,
        resource_id,
        item_order,
        week_number,
        estimated_start_date,
        estimated_end_date,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?)
    `.trim(),
    bindings: {
      id,
      studyPlanId,
      resourceId,
      itemOrder,
      weekNumber,
      status,
      createdAt,
      updatedAt: createdAt,
    },
  };
}
