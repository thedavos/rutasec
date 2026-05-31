import { createFileRoute, notFound } from "@tanstack/react-router";

import { getPublicResourceByIdFn } from "#/modules/catalog";
import { ResourceDetailPage } from "#/modules/catalog/presentation/resource-detail-page";
import { ResourceNotFoundError } from "#/modules/catalog/server/get-public-resource-by-id";
import { getResourceSaveStatusFn } from "#/modules/library";

export const Route = createFileRoute("/resources/$id")({
  loader: async ({ params }) => {
    try {
      const [resource, saveStatus] = await Promise.all([
        getPublicResourceByIdFn({ data: { id: params.id } }),
        getResourceSaveStatusFn({ data: { resourceId: params.id } }),
      ]);

      return { resource, isSaved: saveStatus.isSaved };
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw notFound();
      }
      throw error;
    }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.resource.title ?? "Resource"} — RutaSec` }],
  }),
  component: ResourceDetailRoute,
});

function ResourceDetailRoute() {
  const { resource, isSaved } = Route.useLoaderData();
  return <ResourceDetailPage resource={resource} isSaved={isSaved} />;
}
