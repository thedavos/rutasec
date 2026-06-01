import { createFileRoute, notFound } from "@tanstack/react-router";

import { getPublicResourceByIdFn } from "#/modules/catalog";
import { ResourceDetailPage } from "#/modules/catalog/presentation/resource-detail-page";
import { ResourceNotFoundError } from "#/modules/catalog/server/get-public-resource-by-id";
import { getUserResourceFn } from "#/modules/library";

export const Route = createFileRoute("/resources/$id")({
  loader: async ({ params }) => {
    try {
      const [resource, userResource] = await Promise.all([
        getPublicResourceByIdFn({ data: { id: params.id } }),
        getUserResourceFn({ data: { resourceId: params.id } }),
      ]);

      return { resource, isSaved: userResource !== null, userResource };
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
  const { resource, isSaved, userResource } = Route.useLoaderData();
  return <ResourceDetailPage resource={resource} isSaved={isSaved} userResource={userResource} />;
}
