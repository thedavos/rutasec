import type { CatalogResourceCard } from "#/modules/catalog/domain/entities/resource";
import type { GuestLibraryEntry } from "#/modules/library/domain/entities/guest-library-entry";
import type { PersonalLibraryItem } from "#/modules/library/domain/entities/personal-library-item";

export function mapGuestEntryToLibraryItem(
  entry: GuestLibraryEntry,
  catalogCard: CatalogResourceCard,
): PersonalLibraryItem {
  return {
    userResourceId: `guest-${entry.resourceId}`,
    resourceId: entry.resourceId,
    status: "pending",
    progressPercentage: 0,
    savedAt: entry.savedAt,
    title: catalogCard.title,
    category: catalogCard.category,
    level: catalogCard.level,
    resourceType: catalogCard.resourceType,
    estimatedHours: catalogCard.estimatedHours,
  };
}

export function mapGuestEntriesToLibraryItems(
  entries: GuestLibraryEntry[],
  catalog: CatalogResourceCard[],
): PersonalLibraryItem[] {
  const catalogById = new Map(catalog.map((resource) => [resource.id, resource]));

  return entries
    .map((entry) => {
      const catalogCard = catalogById.get(entry.resourceId);
      if (!catalogCard) {
        return null;
      }
      return mapGuestEntryToLibraryItem(entry, catalogCard);
    })
    .filter((item): item is PersonalLibraryItem => item !== null);
}
