import { getLocale } from "#/paraglide/runtime.js";
import { getPublicSiteOrigin, resolvePublicAssetUrl } from "#/shared/utils/get-public-site-origin";

export type PageHeadInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const DEFAULT_SOCIAL_IMAGE_PATH = "/rutasec.png";

export function buildPageHead(input: PageHeadInput) {
  const pageUrl = `${getPublicSiteOrigin()}${input.path.startsWith("/") ? input.path : `/${input.path}`}`;
  const imageUrl = resolvePublicAssetUrl(input.image?.trim() || DEFAULT_SOCIAL_IMAGE_PATH);
  const ogType = input.type ?? "website";

  const head: {
    meta: Array<Record<string, string | undefined>>;
    links: Array<{ rel: string; href: string }>;
    scripts?: Array<{ type: string; children: string }>;
  } = {
    meta: [
      { title: input.title },
      { name: "description", content: input.description },
      { property: "og:title", content: input.title },
      { property: "og:description", content: input.description },
      { property: "og:url", content: pageUrl },
      { property: "og:image", content: imageUrl },
      { property: "og:type", content: ogType },
      { property: "og:locale", content: getLocale() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: input.title },
      { name: "twitter:description", content: input.description },
      { name: "twitter:image", content: imageUrl },
      { name: "twitter:url", content: pageUrl },
    ],
    links: [{ rel: "canonical", href: pageUrl }],
  };

  if (input.jsonLd) {
    head.scripts = [
      {
        type: "application/ld+json",
        children: JSON.stringify(input.jsonLd),
      },
    ];
  }

  return head;
}
