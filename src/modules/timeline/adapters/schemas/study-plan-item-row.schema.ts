import { z } from "zod";

export const studyPlanItemRowSchema = z.object({
  id: z.string().min(1),
  study_plan_id: z.string().min(1),
  resource_id: z.string().min(1),
  item_order: z.number().int(),
  week_number: z.number().int(),
  estimated_start_date: z.string().nullable(),
  estimated_end_date: z.string().nullable(),
  status: z.enum(["pending", "in_progress", "completed"]),
  created_at: z.string().min(1),
  updated_at: z.string().min(1),
});

export type StudyPlanItemRow = z.infer<typeof studyPlanItemRowSchema>;
