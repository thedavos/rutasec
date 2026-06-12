import * as Sentry from "@sentry/tanstackstart-react";
import { createFileRoute } from "@tanstack/react-router";

import { buildRobotsTxt } from "#/shared/presentation/seo/build-robots-txt";
import { getPublicSiteOrigin } from "#/shared/utils/get-public-site-origin";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        Sentry.startSpan({ name: "robotsTxt" }, () => {
          const origin = getPublicSiteOrigin();
          const body = buildRobotsTxt({
            sitemapUrl: `${origin}/sitemap.xml`,
          });

          return new Response(body, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          });
        }),
    },
  },
});
