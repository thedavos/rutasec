import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getLibraryModule } from "#/app/di/library.module";
import { identityErrorMessage } from "#/modules/identity/domain/errors/identity-errors";
import { requireAuthenticatedAppUser } from "#/modules/identity/server/resolve-authenticated-app-user";
import type { PersonalLibrary } from "#/modules/library/domain/entities/personal-library-item";
import { USER_RESOURCE_STATUSES } from "#/modules/library/domain/entities/user-resource";
import { libraryErrorMessage } from "#/modules/library/domain/errors/library-errors";
import { unwrap } from "#/shared/domain/result";

const getPersonalLibraryInputSchema = z.object({
  status: z.enum(USER_RESOURCE_STATUSES).optional(),
});

export type GetPersonalLibraryInput = z.infer<typeof getPersonalLibraryInputSchema>;

export const getPersonalLibraryFn = createServerFn({ method: "GET" })
  .inputValidator((input: GetPersonalLibraryInput) => getPersonalLibraryInputSchema.parse(input))
  .handler(async ({ data }): Promise<PersonalLibrary> => {
    return Sentry.startSpan({ name: "getPersonalLibrary" }, async () => {
      const authResult = await requireAuthenticatedAppUser();
      if (!authResult.ok) {
        throw new Error(identityErrorMessage(authResult.error));
      }

      const result = await getLibraryModule().getPersonalLibrary.execute({
        userId: authResult.value.id,
        status: data.status,
      });

      if (!result.ok) {
        throw new Error(libraryErrorMessage(result.error));
      }

      return unwrap(result);
    });
  });
