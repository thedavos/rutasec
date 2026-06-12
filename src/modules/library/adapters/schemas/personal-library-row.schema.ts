import { z } from "zod";

import { RESOURCE_LEVELS, RESOURCE_TYPES } from "#/modules/catalog/domain/entities/resource";
import { USER_RESOURCE_STATUSES } from "#/modules/library/domain/entities/user-resource";

export const personalLibraryRowSchema = z.object({
  user_resource_id: z.string(),
  resource_id: z.string(),
  status: z.enum(USER_RESOURCE_STATUSES),
  progress_percentage: z.number(),
  saved_at: z.string(),
  title: z.string(),
  icon_url: z.string().nullable(),
  category: z.string(),
  level: z.enum(RESOURCE_LEVELS),
  resource_type: z.enum(RESOURCE_TYPES),
  estimated_hours: z.number(),
});

export type PersonalLibraryRow = z.infer<typeof personalLibraryRowSchema>;

export const personalLibraryRowListSchema = z.array(personalLibraryRowSchema);
