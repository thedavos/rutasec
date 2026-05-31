import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getLibraryModule } from "#/app/di/library.module";
import { requireAuthenticatedAppUser } from "#/modules/identity/server/resolve-authenticated-app-user";
import { libraryErrorMessage } from "#/modules/library/domain/errors/library-errors";

const resourceSaveStatusInputSchema = z.object({
  resourceId: z.string().min(1),
});

export type ResourceSaveStatusInput = z.infer<typeof resourceSaveStatusInputSchema>;

export type ResourceSaveStatus = {
  isSaved: boolean;
};

export const getResourceSaveStatusFn = createServerFn({ method: "GET" })
  .inputValidator((input: ResourceSaveStatusInput) => resourceSaveStatusInputSchema.parse(input))
  .handler(async ({ data }): Promise<ResourceSaveStatus> => {
    return Sentry.startSpan({ name: "getResourceSaveStatus" }, async () => {
      const authResult = await requireAuthenticatedAppUser();
      if (!authResult.ok) {
        return { isSaved: false };
      }

      const result = await getLibraryModule().getUserResource.execute({
        userId: authResult.value.id,
        resourceId: data.resourceId,
      });

      if (!result.ok) {
        throw new Error(libraryErrorMessage(result.error));
      }

      return { isSaved: result.value !== null };
    });
  });
