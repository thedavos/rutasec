import { createFileRoute } from "@tanstack/react-router";

import { getPublicCatalogFn } from "#/modules/catalog";
import {
  RESOURCE_LEVELS,
  RESOURCE_TYPES,
  type CatalogListInput,
  type ResourceLevel,
  type ResourceType,
} from "#/modules/catalog/domain/entities/resource";
import { CatalogPage } from "#/modules/catalog/presentation/catalog-page";

function parseCatalogSearch(search: Record<string, unknown>): CatalogListInput {
  const input: CatalogListInput = {};

  if (typeof search.category === "string" && search.category.trim()) {
    input.category = search.category.trim();
  }

  if (typeof search.level === "string") {
    const level = search.level as ResourceLevel;
    if (RESOURCE_LEVELS.includes(level)) {
      input.level = level;
    }
  }

  if (typeof search.resourceType === "string") {
    const resourceType = search.resourceType as ResourceType;
    if (RESOURCE_TYPES.includes(resourceType)) {
      input.resourceType = resourceType;
    }
  }

  return input;
}

export const Route = createFileRoute("/")({
  validateSearch: parseCatalogSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => getPublicCatalogFn({ data: deps }),
  head: () => ({
    meta: [{ title: "RutaSec — Cybersecurity Learning Catalog" }],
  }),
  component: HomeRoute,
});

function HomeRoute() {
  const catalog = Route.useLoaderData();
  return <CatalogPage catalog={catalog} />;
}
