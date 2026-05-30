import type { ResourceDetailRow } from "#/modules/catalog/adapters/schemas/resource-row.schema";
import type { CatalogResourceDetail } from "#/modules/catalog/domain/entities/resource";
import { mapResourceRowToCard } from "#/modules/catalog/adapters/mappers/map-resource-row";

export function mapResourceDetailRow(row: ResourceDetailRow): CatalogResourceDetail {
  const card = mapResourceRowToCard(row);

  const pathContext =
    row.path_id &&
    row.path_slug &&
    row.path_title &&
    row.item_order !== null &&
    row.path_total !== null
      ? {
          pathId: row.path_id,
          pathSlug: row.path_slug,
          pathTitle: row.path_title,
          itemOrder: row.item_order,
          totalItems: row.path_total,
        }
      : null;

  return {
    ...card,
    roadmapSection: row.roadmap_section,
    attribution: {
      originalSourceName: row.original_source_name,
      originalSourceUrl: row.original_source_url,
      curatedFromName: row.curated_from_name,
      curatedFromUrl: row.curated_from_url,
    },
    tags: [],
    pathContext,
  };
}
