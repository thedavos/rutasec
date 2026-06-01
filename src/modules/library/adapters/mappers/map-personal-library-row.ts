import type { PersonalLibraryItem } from "#/modules/library/domain/entities/personal-library-item";
import type { PersonalLibraryRow } from "#/modules/library/adapters/schemas/personal-library-row.schema";

export function mapPersonalLibraryRowToItem(row: PersonalLibraryRow): PersonalLibraryItem {
  return {
    userResourceId: row.user_resource_id,
    resourceId: row.resource_id,
    status: row.status,
    progressPercentage: row.progress_percentage,
    savedAt: row.saved_at,
    title: row.title,
    category: row.category,
    level: row.level,
    resourceType: row.resource_type,
    estimatedHours: row.estimated_hours,
  };
}
