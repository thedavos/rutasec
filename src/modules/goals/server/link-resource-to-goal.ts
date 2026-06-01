import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getGoalsModule } from "#/app/di/goals.module";
import { identityErrorMessage } from "#/modules/identity/domain/errors/identity-errors";
import { requireAuthenticatedAppUser } from "#/modules/identity/server/resolve-authenticated-app-user";
import { goalErrorMessage } from "#/modules/goals/domain/errors/goal-errors";
import { unwrap } from "#/shared/domain/result";

const linkResourceToGoalInputSchema = z.object({
  goalId: z.string().trim().min(1),
  resourceId: z.string().trim().min(1),
});

export type LinkResourceToGoalInput = z.infer<typeof linkResourceToGoalInputSchema>;

export const linkResourceToGoalFn = createServerFn({ method: "POST" })
  .inputValidator((input: LinkResourceToGoalInput) => linkResourceToGoalInputSchema.parse(input))
  .handler(async ({ data }): Promise<void> => {
    return Sentry.startSpan({ name: "linkResourceToGoal" }, async () => {
      const authResult = await requireAuthenticatedAppUser();
      if (!authResult.ok) {
        throw new Error(identityErrorMessage(authResult.error));
      }

      const result = await getGoalsModule().linkResourceToGoal.execute({
        userId: authResult.value.id,
        goalId: data.goalId,
        resourceId: data.resourceId,
      });

      if (!result.ok) {
        throw new Error(goalErrorMessage(result.error));
      }

      return unwrap(result);
    });
  });
