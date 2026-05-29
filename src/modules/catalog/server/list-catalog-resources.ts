import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";

import { getCatalogModule } from "#/app/di/catalog.module";
import type { CatalogListInput } from "#/modules/catalog/domain/entities/resource";
import { catalogErrorMessage } from "#/modules/catalog/domain/errors/catalog-errors";

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

export const listCatalogResourcesFn = createServerFn({ method: "GET" })
  .inputValidator((input?: CatalogListInput) => parseCatalogListInput(input))
  .handler(async ({ data }) => {
    return Sentry.startSpan({ name: "listCatalogResources" }, async () => {
      const result = await getCatalogModule().listCatalogResources.execute(data);
      if (!result.ok) {
        throw new Error(catalogErrorMessage(result.error));
      }
      return result.value;
    });
  });
