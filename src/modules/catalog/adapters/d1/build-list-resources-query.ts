import type { CatalogFilters } from "#/modules/catalog/domain/entities/resource";

const CARD_SELECT = `
  id,
  title,
  description,
  url,
  phase,
  category,
  topic,
  subtopic,
  resource_type,
  level,
  estimated_hours,
  is_free,
  language,
  original_source_name,
  curated_from_name
`.trim();

export type ListResourcesQuery = {
  sql: string;
  bindings: unknown[];
};

export function buildListResourcesQuery(filters: CatalogFilters): ListResourcesQuery {
  const conditions = ["is_published = 1"];
  const bindings: unknown[] = [];

  if (filters.category) {
    conditions.push("category = ?");
    bindings.push(filters.category);
  }

  if (filters.level) {
    conditions.push("level = ?");
    bindings.push(filters.level);
  }

  if (filters.resourceType) {
    conditions.push("resource_type = ?");
    bindings.push(filters.resourceType);
  }

  const sql = `
    SELECT ${CARD_SELECT}
    FROM resources
    WHERE ${conditions.join(" AND ")}
    ORDER BY phase ASC, category ASC, topic ASC, title ASC
  `.trim();

  return { sql, bindings };
}
