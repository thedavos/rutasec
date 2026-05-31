import { z } from "zod";

export const appUserRowSchema = z.object({
  id: z.string().min(1),
  auth_user_id: z.string().min(1),
  email: z.email(),
  display_name: z.string().nullable(),
  role: z.enum(["user", "admin"]),
  created_at: z.string().min(1),
  updated_at: z.string().min(1),
});

export type AppUserRow = z.infer<typeof appUserRowSchema>;
