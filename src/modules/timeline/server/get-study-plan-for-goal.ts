import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getTimelineModule } from "#/app/di/timeline.module";
import { identityErrorMessage } from "#/modules/identity/domain/errors/identity-errors";
import { requireAuthenticatedAppUser } from "#/modules/identity/server/resolve-authenticated-app-user";
import type { StudyPlan } from "#/modules/timeline/domain/entities/study-plan";
import { studyPlanErrorMessage } from "#/modules/timeline/domain/errors/study-plan-errors";
import { unwrap } from "#/shared/domain/result";

const getStudyPlanInputSchema = z.object({
  goalId: z.string().trim().min(1),
});

export type GetStudyPlanForGoalServerInput = z.infer<typeof getStudyPlanInputSchema>;

export const getStudyPlanForGoalFn = createServerFn({ method: "GET" })
  .inputValidator((input: GetStudyPlanForGoalServerInput) => getStudyPlanInputSchema.parse(input))
  .handler(async ({ data }): Promise<StudyPlan | null> => {
    return Sentry.startSpan({ name: "getStudyPlanForGoal" }, async () => {
      const authResult = await requireAuthenticatedAppUser();
      if (!authResult.ok) {
        throw new Error(identityErrorMessage(authResult.error));
      }

      const result = await getTimelineModule().getStudyPlanForGoal.execute({
        userId: authResult.value.id,
        goalId: data.goalId,
      });

      if (!result.ok) {
        throw new Error(studyPlanErrorMessage(result.error));
      }

      return unwrap(result);
    });
  });
