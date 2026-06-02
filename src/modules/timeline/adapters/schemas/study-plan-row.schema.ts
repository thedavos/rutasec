import { z } from "zod";

export const studyPlanRowSchema = z.object({
  id: z.string().min(1),
  user_id: z.string().min(1),
  goal_id: z.string().min(1),
  title: z.string().min(1),
  total_estimated_hours: z.number(),
  estimated_weeks: z.number(),
  status: z.enum(["active", "archived"]),
  generated_by: z.enum(["system", "user"]),
  created_at: z.string().min(1),
  updated_at: z.string().min(1),
});

export type StudyPlanRow = z.infer<typeof studyPlanRowSchema>;
