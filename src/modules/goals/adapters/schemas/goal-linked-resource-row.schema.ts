import { z } from "zod";

export const goalLinkedResourceRowSchema = z.object({
  goal_id: z.string().min(1),
  resource_id: z.string().min(1),
  priority: z.number().int(),
  linked_at: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  level: z.string().min(1),
  resource_type: z.string().min(1),
});

export type GoalLinkedResourceRow = z.infer<typeof goalLinkedResourceRowSchema>;
