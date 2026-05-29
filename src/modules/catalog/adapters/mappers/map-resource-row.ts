import type { CatalogResourceCard } from "#/modules/catalog/domain/entities/resource";
import type { ResourceRow } from "#/modules/catalog/adapters/schemas/resource-row.schema";

export function mapResourceRowToCard(row: ResourceRow): CatalogResourceCard {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    phase: row.phase,
    category: row.category,
    topic: row.topic,
    subtopic: row.subtopic,
    resourceType: row.resource_type,
    level: row.level,
    estimatedHours: row.estimated_hours,
    isFree: row.is_free === 1,
    language: row.language,
    attribution: {
      originalSourceName: row.original_source_name,
      curatedFromName: row.curated_from_name,
    },
  };
}
