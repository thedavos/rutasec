import * as Sentry from "@sentry/tanstackstart-react";
import { createFileRoute } from "@tanstack/react-router";

import { listCatalogResourcesFn } from "#/modules/catalog";
import { buildSitemapXml } from "#/shared/presentation/seo/build-sitemap-xml";
import { getPublicSiteOrigin } from "#/shared/utils/get-public-site-origin";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        Sentry.startSpan({ name: "sitemapXml" }, async () => {
          const origin = getPublicSiteOrigin();
          const catalog = await listCatalogResourcesFn({ data: undefined });

          const xml = buildSitemapXml([
            {
              loc: `${origin}/`,
              changefreq: "daily",
              priority: "1.0",
            },
            {
              loc: `${origin}/send-resource`,
              changefreq: "monthly",
              priority: "0.6",
            },
            ...catalog.resources.map((resource) => ({
              loc: `${origin}/resources/${resource.id}`,
              changefreq: "weekly" as const,
              priority: "0.8",
            })),
          ]);

          return new Response(xml, {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          });
        }),
    },
  },
});
