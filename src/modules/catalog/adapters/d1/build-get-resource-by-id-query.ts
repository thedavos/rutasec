export type GetResourceByIdQuery = {
  sql: string;
  bindings: unknown[];
};

const DETAIL_SELECT = `
  r.id,
  r.title,
  r.description,
  r.url,
  r.phase,
  r.category,
  r.topic,
  r.subtopic,
  r.resource_type,
  r.level,
  r.estimated_hours,
  r.is_free,
  r.language,
  r.original_source_name,
  r.original_source_url,
  r.curated_from_name,
  r.curated_from_url,
  r.roadmap_section,
  lp.id AS path_id,
  lp.slug AS path_slug,
  lp.title AS path_title,
  lpi.item_order,
  (
    SELECT COUNT(*)
    FROM learning_path_items lpi_count
    WHERE lpi_count.learning_path_id = lp.id
  ) AS path_total
`.trim();

export function buildGetResourceByIdQuery(id: string): GetResourceByIdQuery {
  const sql = `
    SELECT ${DETAIL_SELECT}
    FROM resources r
    LEFT JOIN learning_path_items lpi ON lpi.resource_id = r.id
    LEFT JOIN learning_paths lp ON lp.id = lpi.learning_path_id AND lp.is_published = 1
    WHERE r.id = ? AND r.is_published = 1
    LIMIT 1
  `.trim();

  return { sql, bindings: [id] };
}

export function buildResourceTagSlugsQuery(resourceId: string): GetResourceByIdQuery {
  const sql = `
    SELECT t.slug AS slug
    FROM tags t
    INNER JOIN resource_tags rt ON rt.tag_id = t.id
    WHERE rt.resource_id = ?
    ORDER BY t.slug ASC
  `.trim();

  return { sql, bindings: [resourceId] };
}
