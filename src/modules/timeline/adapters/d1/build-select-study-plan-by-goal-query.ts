const STUDY_PLAN_SELECT = `
  id,
  user_id,
  goal_id,
  title,
  total_estimated_hours,
  estimated_weeks,
  status,
  generated_by,
  created_at,
  updated_at
`.trim();

const STUDY_PLAN_ITEM_SELECT = `
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
`.trim();

export type SelectActiveStudyPlanByGoalQuery = {
  sql: string;
  bindings: {
    userId: string;
    goalId: string;
  };
};

export type SelectStudyPlanItemsQuery = {
  sql: string;
  bindings: {
    studyPlanId: string;
  };
};

export function buildSelectActiveStudyPlanByGoalQuery(
  userId: string,
  goalId: string,
): SelectActiveStudyPlanByGoalQuery {
  return {
    sql: `
      SELECT ${STUDY_PLAN_SELECT}
      FROM study_plans
      WHERE user_id = ? AND goal_id = ? AND status = 'active'
      LIMIT 1
    `.trim(),
    bindings: { userId, goalId },
  };
}

export function buildSelectStudyPlanItemsQuery(studyPlanId: string): SelectStudyPlanItemsQuery {
  return {
    sql: `
      SELECT ${STUDY_PLAN_ITEM_SELECT}
      FROM study_plan_items
      WHERE study_plan_id = ?
      ORDER BY item_order ASC
    `.trim(),
    bindings: { studyPlanId },
  };
}
