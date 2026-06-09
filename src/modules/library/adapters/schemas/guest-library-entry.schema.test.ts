import { describe, expect, it } from "vite-plus/test";

import { guestLibraryEntrySchema } from "#/modules/library/adapters/schemas/guest-library-entry.schema";

describe("guestLibraryEntrySchema", () => {
  it("accepts a valid guest library entry", () => {
    const parsed = guestLibraryEntrySchema.safeParse({
      resourceId: "res-1",
      savedAt: "2026-06-08T12:00:00.000Z",
      syncStatus: "pending",
      syncError: null,
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects entries with empty resourceId", () => {
    const parsed = guestLibraryEntrySchema.safeParse({
      resourceId: "",
      savedAt: "2026-06-08T12:00:00.000Z",
      syncStatus: "pending",
      syncError: null,
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects unknown sync statuses", () => {
    const parsed = guestLibraryEntrySchema.safeParse({
      resourceId: "res-1",
      savedAt: "2026-06-08T12:00:00.000Z",
      syncStatus: "unknown",
      syncError: null,
    });

    expect(parsed.success).toBe(false);
  });
});
