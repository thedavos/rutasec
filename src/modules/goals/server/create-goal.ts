import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getGoalsModule } from "#/app/di/goals.module";
import { identityErrorMessage } from "#/modules/identity/domain/errors/identity-errors";
import { requireAuthenticatedAppUser } from "#/modules/identity/server/resolve-authenticated-app-user";
import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import { goalErrorMessage } from "#/modules/goals/domain/errors/goal-errors";
import { unwrap } from "#/shared/domain/result";

const createGoalInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  targetDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Target date must be YYYY-MM-DD")
    .optional(),
  hoursPerWeek: z.number().positive(),
});

export type CreateGoalInput = z.infer<typeof createGoalInputSchema>;

export const createGoalFn = createServerFn({ method: "POST" })
  .inputValidator((input: CreateGoalInput) => createGoalInputSchema.parse(input))
  .handler(async ({ data }): Promise<LearningGoal> => {
    return Sentry.startSpan({ name: "createGoal" }, async () => {
      const authResult = await requireAuthenticatedAppUser();
      if (!authResult.ok) {
        throw new Error(identityErrorMessage(authResult.error));
      }

      const result = await getGoalsModule().createGoal.execute({
        userId: authResult.value.id,
        title: data.title,
        description: data.description,
        targetDate: data.targetDate,
        hoursPerWeek: data.hoursPerWeek,
      });

      if (!result.ok) {
        throw new Error(goalErrorMessage(result.error));
      }

      return unwrap(result);
    });
  });
