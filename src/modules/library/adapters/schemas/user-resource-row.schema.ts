import { z } from "zod";

import { USER_RESOURCE_STATUSES } from "#/modules/library/domain/entities/user-resource";

export const userResourceRowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  resource_id: z.string(),
  status: z.enum(USER_RESOURCE_STATUSES),
  progress_percentage: z.number(),
  notes: z.string().nullable(),
  started_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserResourceRow = z.infer<typeof userResourceRowSchema>;
