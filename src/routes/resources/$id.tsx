import { createFileRoute, notFound } from "@tanstack/react-router";

import { getPublicResourceByIdFn } from "#/modules/catalog";
import { ResourceDetailPage } from "#/modules/catalog/presentation/resource-detail-page";
import { ResourceNotFoundError } from "#/modules/catalog/server/get-public-resource-by-id";

export const Route = createFileRoute("/resources/$id")({
  loader: async ({ params }) => {
    try {
      return await getPublicResourceByIdFn({ data: { id: params.id } });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw notFound();
      }
      throw error;
    }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? "Resource"} — RutaSec` }],
  }),
  component: ResourceDetailRoute,
});

function ResourceDetailRoute() {
  const resource = Route.useLoaderData();
  return <ResourceDetailPage resource={resource} />;
}
