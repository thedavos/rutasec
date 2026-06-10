import { describe, expect, it } from "vite-plus/test";

import type { CatalogResourceCard } from "#/modules/catalog/domain/entities/resource";
import { mapGuestEntriesToLibraryItems } from "#/modules/library/presentation/guest-library/map-guest-library-items";
import type { GuestLibraryEntry } from "#/modules/library/domain/entities/guest-library-entry";

const catalogCard: CatalogResourceCard = {
  id: "res-1",
  title: "Web Pentesting 101",
  description: null,
  url: "https://example.com",
  iconUrl: null,
  phase: "foundation",
  category: "Web",
  topic: "Pentesting",
  subtopic: null,
  resourceType: "course",
  level: "beginner",
  estimatedHours: 4,
  isFree: true,
  language: "en",
  attribution: {
    originalSourceName: "Example",
    originalSourceUrl: "https://example.com",
    curatedFromName: "RutaSec",
    curatedFromUrl: "https://rutasec.test",
  },
};

const guestEntry: GuestLibraryEntry = {
  resourceId: "res-1",
  savedAt: "2026-06-08T12:00:00.000Z",
  syncStatus: "pending",
  syncError: null,
};

describe("mapGuestEntriesToLibraryItems", () => {
  it("maps guest entries to personal library items using catalog metadata", () => {
    const items = mapGuestEntriesToLibraryItems([guestEntry], [catalogCard]);

    expect(items).toEqual([
      {
        userResourceId: "guest-res-1",
        resourceId: "res-1",
        status: "pending",
        progressPercentage: 0,
        savedAt: "2026-06-08T12:00:00.000Z",
        title: "Web Pentesting 101",
        category: "Web",
        level: "beginner",
        resourceType: "course",
        estimatedHours: 4,
      },
    ]);
  });

  it("drops guest entries that no longer exist in the catalog", () => {
    const items = mapGuestEntriesToLibraryItems(
      [{ ...guestEntry, resourceId: "missing" }],
      [catalogCard],
    );

    expect(items).toEqual([]);
  });
});
