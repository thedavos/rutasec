import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { getIdentityModule } from "#/app/di/identity.module";
import type { AppUser } from "#/modules/identity/domain/entities/app-user";
import { identityErrorMessage } from "#/modules/identity/domain/errors/identity-errors";
import type { IdentityError } from "#/modules/identity/domain/errors/identity-errors";
import type { Result } from "#/shared/domain/result";

export async function requireAuthenticatedAppUser(): Promise<Result<AppUser, IdentityError>> {
  return getIdentityModule().resolveAuthenticatedAppUser.execute({
    headers: getRequestHeaders(),
  });
}

export const resolveAuthenticatedAppUserFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AppUser> => {
    return Sentry.startSpan({ name: "resolveAuthenticatedAppUser" }, async () => {
      const result = await requireAuthenticatedAppUser();
      if (!result.ok) {
        throw new Error(identityErrorMessage(result.error));
      }
      return result.value;
    });
  },
);
