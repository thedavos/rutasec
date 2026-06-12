import { createFileRoute, notFound } from "@tanstack/react-router";

import { getPublicResourceByIdFn } from "#/modules/catalog";
import { ResourceDetailPage } from "#/modules/catalog/presentation/resource-detail-page";
import { ResourceNotFoundError } from "#/modules/catalog/server/get-public-resource-by-id";
import { getUserResourceFn } from "#/modules/library";
import * as m from "#/paraglide/messages.js";
import { buildPageHead } from "#/shared/presentation/seo/build-page-head";
import { buildResourceJsonLd } from "#/shared/presentation/seo/build-resource-json-ld";
import { getPublicSiteOrigin } from "#/shared/utils/get-public-site-origin";
import { truncateMetaDescription } from "#/shared/utils/truncate-meta-description";

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
  head: ({ loaderData, params }) => {
    const resource = loaderData?.resource;
    const path = `/resources/${params.id}`;

    return buildPageHead({
      title: m.meta_resource_title({
        title: resource?.title ?? m.meta_resource_title_fallback(),
      }),
      description:
        truncateMetaDescription(resource?.description) ?? m.meta_resource_description_fallback(),
      path,
      image: resource?.iconUrl,
      type: "article",
      jsonLd: resource
        ? buildResourceJsonLd(
            {
              path,
              title: resource.title,
              description: resource.description,
              resourceUrl: resource.url,
              iconUrl: resource.iconUrl,
              resourceType: resource.resourceType,
              isFree: resource.isFree,
              language: resource.language,
              sourceName: resource.attribution.originalSourceName,
              sourceUrl: resource.attribution.originalSourceUrl,
            },
            getPublicSiteOrigin(),
          )
        : undefined,
    });
  },
  component: ResourceDetailRoute,
});

function ResourceDetailRoute() {
  const { resource, isSaved, userResource } = Route.useLoaderData();
  return <ResourceDetailPage resource={resource} isSaved={isSaved} userResource={userResource} />;
}
