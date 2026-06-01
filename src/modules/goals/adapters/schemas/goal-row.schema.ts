import { z } from "zod";

import { GOAL_STATUSES } from "#/modules/goals/domain/entities/goal";

export const goalRowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  target_date: z.string().nullable(),
  hours_per_week: z.number(),
  status: z.enum(GOAL_STATUSES),
  created_at: z.string(),
  updated_at: z.string(),
});

export type GoalRow = z.infer<typeof goalRowSchema>;
