import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";

import { getCatalogModule } from "#/app/di/catalog.module";
import type { CatalogFilterOptions } from "#/modules/catalog/domain/entities/resource";
import { catalogErrorMessage } from "#/modules/catalog/domain/errors/catalog-errors";

export const getCatalogFilterOptionsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<CatalogFilterOptions> => {
    return Sentry.startSpan({ name: "getCatalogFilterOptions" }, async () => {
      const result = await getCatalogModule().getCatalogFilterOptions.execute();
      if (!result.ok) {
        throw new Error(catalogErrorMessage(result.error));
      }
      return result.value;
    });
  },
);
