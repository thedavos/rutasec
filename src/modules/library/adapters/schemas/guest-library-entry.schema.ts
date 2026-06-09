import { z } from "zod";

import { GUEST_LIBRARY_SYNC_STATUSES } from "#/modules/library/domain/entities/guest-library-entry";

export const guestLibraryEntrySchema = z.object({
  resourceId: z.string().min(1),
  savedAt: z.string().datetime(),
  syncStatus: z.enum(GUEST_LIBRARY_SYNC_STATUSES),
  syncError: z.string().nullable(),
});

export type GuestLibraryEntryRow = z.infer<typeof guestLibraryEntrySchema>;
