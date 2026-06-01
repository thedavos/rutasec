import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";

import { getGoalsModule } from "#/app/di/goals.module";
import { identityErrorMessage } from "#/modules/identity/domain/errors/identity-errors";
import { requireAuthenticatedAppUser } from "#/modules/identity/server/resolve-authenticated-app-user";
import type { UserGoals } from "#/modules/goals/domain/entities/goal";
import { goalErrorMessage } from "#/modules/goals/domain/errors/goal-errors";
import { unwrap } from "#/shared/domain/result";

export const listUserGoalsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<UserGoals> => {
    return Sentry.startSpan({ name: "listUserGoals" }, async () => {
      const authResult = await requireAuthenticatedAppUser();
      if (!authResult.ok) {
        throw new Error(identityErrorMessage(authResult.error));
      }

      const result = await getGoalsModule().listUserGoals.execute({
        userId: authResult.value.id,
      });

      if (!result.ok) {
        throw new Error(goalErrorMessage(result.error));
      }

      return unwrap(result);
    });
  },
);
