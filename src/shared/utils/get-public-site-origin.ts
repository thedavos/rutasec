const DEFAULT_PUBLIC_SITE_ORIGIN = "http://localhost:3000";

function readConfiguredPublicSiteOrigin(): string | undefined {
  const publicSiteUrl = process.env.PUBLIC_SITE_URL?.trim();
  if (publicSiteUrl) {
    return publicSiteUrl;
  }

  return process.env.BETTER_AUTH_URL?.trim() || undefined;
}

export function getPublicSiteOrigin(): string {
  const origin = readConfiguredPublicSiteOrigin() || DEFAULT_PUBLIC_SITE_ORIGIN;
  return origin.replace(/\/$/, "");
}

export function resolvePublicAssetUrl(pathOrUrl: string): string {
  const trimmed = pathOrUrl.trim();
  if (!trimmed) {
    return `${getPublicSiteOrigin()}/rutasec.png`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${getPublicSiteOrigin()}${normalizedPath}`;
}
