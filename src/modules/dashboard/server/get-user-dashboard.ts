import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";

import { getDashboardModule } from "#/app/di/dashboard.module";
import { dashboardErrorMessage } from "#/modules/dashboard/domain/errors/dashboard-errors";
import type { UserDashboard } from "#/modules/dashboard/domain/entities/user-dashboard";
import { identityErrorMessage } from "#/modules/identity/domain/errors/identity-errors";
import { requireAuthenticatedAppUser } from "#/modules/identity/server/resolve-authenticated-app-user";
import { unwrap } from "#/shared/domain/result";

export const getUserDashboardFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<UserDashboard> => {
    return Sentry.startSpan({ name: "getUserDashboard" }, async () => {
      const authResult = await requireAuthenticatedAppUser();
      if (!authResult.ok) {
        throw new Error(identityErrorMessage(authResult.error));
      }

      const result = await getDashboardModule().getUserDashboard.execute({
        userId: authResult.value.id,
      });

      if (!result.ok) {
        throw new Error(dashboardErrorMessage(result.error));
      }

      return unwrap(result);
    });
  },
);
