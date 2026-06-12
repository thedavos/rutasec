import { resolvePublicAssetUrl } from "#/shared/utils/get-public-site-origin";
import { truncateMetaDescription } from "#/shared/utils/truncate-meta-description";

export type ResourceJsonLdInput = {
  path: string;
  title: string;
  description: string | null;
  resourceUrl: string;
  iconUrl: string | null;
  resourceType: string;
  isFree: boolean;
  language: string | null;
  sourceName: string;
  sourceUrl: string;
};

export function buildResourcePageUrl(path: string, origin: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}

export function buildResourceJsonLd(input: ResourceJsonLdInput, origin: string) {
  const pageUrl = buildResourcePageUrl(input.path, origin);
  const description = truncateMetaDescription(input.description) ?? `${input.title} on RutaSec.`;

  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: input.title,
    description,
    url: pageUrl,
    image: resolvePublicAssetUrl(input.iconUrl ?? ""),
    learningResourceType: input.resourceType,
    isAccessibleForFree: input.isFree,
    ...(input.language ? { inLanguage: input.language } : {}),
    mainEntityOfPage: pageUrl,
    provider: {
      "@type": "Organization",
      name: input.sourceName,
      url: input.sourceUrl,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "RutaSec",
      url: origin,
    },
    sameAs: input.resourceUrl,
  };
}
