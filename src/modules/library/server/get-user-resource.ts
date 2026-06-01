import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getLibraryModule } from "#/app/di/library.module";
import { requireAuthenticatedAppUser } from "#/modules/identity/server/resolve-authenticated-app-user";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import { libraryErrorMessage } from "#/modules/library/domain/errors/library-errors";
import { unwrap } from "#/shared/domain/result";

const getUserResourceInputSchema = z.object({
  resourceId: z.string().min(1),
});

export type GetUserResourceInput = z.infer<typeof getUserResourceInputSchema>;

export const getUserResourceFn = createServerFn({ method: "GET" })
  .inputValidator((input: GetUserResourceInput) => getUserResourceInputSchema.parse(input))
  .handler(async ({ data }): Promise<SavedUserResource | null> => {
    return Sentry.startSpan({ name: "getUserResource" }, async () => {
      const authResult = await requireAuthenticatedAppUser();
      if (!authResult.ok) {
        return null;
      }

      const result = await getLibraryModule().getUserResource.execute({
        userId: authResult.value.id,
        resourceId: data.resourceId,
      });

      if (!result.ok) {
        throw new Error(libraryErrorMessage(result.error));
      }

      return unwrap(result);
    });
  });
