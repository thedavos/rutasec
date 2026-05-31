import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getLibraryModule } from "#/app/di/library.module";
import { identityErrorMessage } from "#/modules/identity/domain/errors/identity-errors";
import { requireAuthenticatedAppUser } from "#/modules/identity/server/resolve-authenticated-app-user";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import { libraryErrorMessage } from "#/modules/library/domain/errors/library-errors";
import { unwrap } from "#/shared/domain/result";

const saveResourceInputSchema = z.object({
  resourceId: z.string().min(1),
});

export type SaveResourceInput = z.infer<typeof saveResourceInputSchema>;

export const saveResourceFn = createServerFn({ method: "POST" })
  .inputValidator((input: SaveResourceInput) => saveResourceInputSchema.parse(input))
  .handler(async ({ data }): Promise<SavedUserResource> => {
    return Sentry.startSpan({ name: "saveResource" }, async () => {
      const authResult = await requireAuthenticatedAppUser();
      if (!authResult.ok) {
        throw new Error(identityErrorMessage(authResult.error));
      }

      const result = await getLibraryModule().saveResource.execute({
        userId: authResult.value.id,
        resourceId: data.resourceId,
      });

      if (!result.ok) {
        throw new Error(libraryErrorMessage(result.error));
      }

      return unwrap(result);
    });
  });
