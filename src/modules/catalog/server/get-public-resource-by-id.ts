import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";

import { getCatalogModule } from "#/app/di/catalog.module";
import type { CatalogResourceDetail } from "#/modules/catalog/domain/entities/resource";
import { catalogErrorMessage } from "#/modules/catalog/domain/errors/catalog-errors";
import { unwrap } from "#/shared/domain/result";

export type GetPublicResourceByIdInput = {
  id: string;
};

export class ResourceNotFoundError extends Error {
  constructor() {
    super("Resource not found");
    this.name = "ResourceNotFoundError";
  }
}

function parseGetPublicResourceByIdInput(
  input: GetPublicResourceByIdInput,
): GetPublicResourceByIdInput {
  const id = input.id.trim();
  if (!id) {
    throw new Error("Resource id is required");
  }
  return { id };
}

export const getPublicResourceByIdFn = createServerFn({ method: "GET" })
  .inputValidator((input: GetPublicResourceByIdInput) => parseGetPublicResourceByIdInput(input))
  .handler(async ({ data }): Promise<CatalogResourceDetail> => {
    return Sentry.startSpan({ name: "getPublicResourceById" }, async () => {
      const result = await getCatalogModule().getPublicResourceById.execute(data.id);
      if (!result.ok) {
        if (result.error.type === "not_found") {
          throw new ResourceNotFoundError();
        }
        throw new Error(catalogErrorMessage(result.error));
      }
      return unwrap(result);
    });
  });
