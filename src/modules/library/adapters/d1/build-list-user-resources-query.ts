import type { UserResourceStatus } from "#/modules/library/domain/entities/user-resource";

const LIBRARY_SELECT = `
  ur.id AS user_resource_id,
  ur.resource_id,
  ur.status,
  ur.progress_percentage,
  ur.created_at AS saved_at,
  r.title,
  r.icon_url,
  r.category,
  r.level,
  r.resource_type,
  r.estimated_hours
`.trim();

export type ListUserResourcesQuery = {
  sql: string;
  bindings: { userId: string; status?: UserResourceStatus };
};

export function buildListUserResourcesQuery(
  userId: string,
  status?: UserResourceStatus,
): ListUserResourcesQuery {
  const conditions = ["ur.user_id = ?"];
  const bindings: { userId: string; status?: UserResourceStatus } = { userId };

  if (status) {
    conditions.push("ur.status = ?");
    bindings.status = status;
  }

  const sql = `
    SELECT ${LIBRARY_SELECT}
    FROM user_resources ur
    INNER JOIN resources r ON r.id = ur.resource_id
    WHERE ${conditions.join(" AND ")}
    ORDER BY ur.updated_at DESC
  `.trim();

  return { sql, bindings };
}
