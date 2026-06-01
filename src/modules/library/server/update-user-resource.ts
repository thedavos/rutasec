import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getLibraryModule } from "#/app/di/library.module";
import { identityErrorMessage } from "#/modules/identity/domain/errors/identity-errors";
import { requireAuthenticatedAppUser } from "#/modules/identity/server/resolve-authenticated-app-user";
import { USER_RESOURCE_STATUSES } from "#/modules/library/domain/entities/user-resource";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import { libraryErrorMessage } from "#/modules/library/domain/errors/library-errors";
import { unwrap } from "#/shared/domain/result";

const updateUserResourceInputSchema = z.object({
  resourceId: z.string().min(1),
  status: z.enum(USER_RESOURCE_STATUSES),
  progressPercentage: z.number().int().min(0).max(100),
});

export type UpdateUserResourceServerInput = z.infer<typeof updateUserResourceInputSchema>;

export const updateUserResourceFn = createServerFn({ method: "POST" })
  .inputValidator((input: UpdateUserResourceServerInput) =>
    updateUserResourceInputSchema.parse(input),
  )
  .handler(async ({ data }): Promise<SavedUserResource> => {
    return Sentry.startSpan({ name: "updateUserResource" }, async () => {
      const authResult = await requireAuthenticatedAppUser();
      if (!authResult.ok) {
        throw new Error(identityErrorMessage(authResult.error));
      }

      const result = await getLibraryModule().updateUserResource.execute({
        userId: authResult.value.id,
        resourceId: data.resourceId,
        status: data.status,
        progressPercentage: data.progressPercentage,
      });

      if (!result.ok) {
        throw new Error(libraryErrorMessage(result.error));
      }

      return unwrap(result);
    });
  });
