import type { CatalogFilters } from "#/modules/catalog/domain/entities/resource";

const CARD_SELECT = `
  id,
  title,
  description,
  url,
  icon_url,
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
  original_source_url,
  curated_from_name,
  curated_from_url
`.trim();

export type ListResourcesQuery = {
  sql: string;
  bindings: unknown[];
};

export function tokenizeSearchQuery(q: string): string[] {
  return q.trim().split(/\s+/).filter(Boolean);
}

function appendSearchTokenCondition(
  conditions: string[],
  bindings: unknown[],
  token: string,
): void {
  const pattern = `%${token}%`;
  conditions.push(`(
    LOWER(title) LIKE LOWER(?)
    OR LOWER(topic) LIKE LOWER(?)
    OR LOWER(category) LIKE LOWER(?)
    OR EXISTS (
      SELECT 1
      FROM resource_tags rt
      INNER JOIN tags t ON t.id = rt.tag_id
      WHERE rt.resource_id = resources.id
        AND (LOWER(t.slug) LIKE LOWER(?) OR LOWER(t.name) LIKE LOWER(?))
    )
  )`);
  bindings.push(pattern, pattern, pattern, pattern, pattern);
}

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

  if (filters.q) {
    for (const token of tokenizeSearchQuery(filters.q)) {
      appendSearchTokenCondition(conditions, bindings, token);
    }
  }

  const sql = `
    SELECT ${CARD_SELECT}
    FROM resources
    WHERE ${conditions.join(" AND ")}
    ORDER BY phase ASC, category ASC, topic ASC, title ASC
  `.trim();

  return { sql, bindings };
}
