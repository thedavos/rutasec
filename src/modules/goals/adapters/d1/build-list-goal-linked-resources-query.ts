const LINKED_RESOURCE_SELECT = `
  gr.goal_id,
  gr.resource_id,
  gr.priority,
  gr.created_at AS linked_at,
  r.title,
  r.category,
  r.level,
  r.resource_type,
  r.estimated_hours
`.trim();

export type ListGoalLinkedResourcesQuery = {
  sql: string;
  bindings: { userId: string };
};

export function buildListGoalLinkedResourcesQuery(userId: string): ListGoalLinkedResourcesQuery {
  const sql = `
    SELECT ${LINKED_RESOURCE_SELECT}
    FROM goal_resources gr
    INNER JOIN goals g ON g.id = gr.goal_id
    INNER JOIN resources r ON r.id = gr.resource_id
    WHERE g.user_id = ?
    ORDER BY gr.goal_id, gr.priority, gr.created_at
  `.trim();

  return {
    sql,
    bindings: { userId },
  };
}
