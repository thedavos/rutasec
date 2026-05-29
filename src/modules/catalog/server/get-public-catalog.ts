import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";

import { getCatalogModule } from "#/app/di/catalog.module";
import type {
  CatalogListInput,
  PublicCatalogResult,
} from "#/modules/catalog/domain/entities/resource";
import { catalogErrorMessage } from "#/modules/catalog/domain/errors/catalog-errors";
import { unwrap } from "#/shared/domain/result";

function parseCatalogListInput(input?: CatalogListInput): CatalogListInput | undefined {
  if (!input) {
    return undefined;
  }

  return {
    category: input.category,
    level: input.level,
    resourceType: input.resourceType,
  };
}

export const getPublicCatalogFn = createServerFn({ method: "GET" })
  .inputValidator((input?: CatalogListInput) => parseCatalogListInput(input))
  .handler(async ({ data }): Promise<PublicCatalogResult> => {
    return Sentry.startSpan({ name: "getPublicCatalog" }, async () => {
      const result = await getCatalogModule().getPublicCatalog.execute(data);
      if (!result.ok) {
        throw new Error(catalogErrorMessage(result.error));
      }
      return unwrap(result);
    });
  });
