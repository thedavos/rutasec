import { resolveResourceIconUrl } from "#/shared/utils/resolve-resource-icon-url";

const TIMEOUT_MS = 5_000;

export type IconResolution = {
  iconUrl: string | null;
  warning: string | null;
};

export async function resolveIconUrl(resourceUrl: string): Promise<IconResolution> {
  const trimmed = resourceUrl.trim();
  if (!trimmed) {
    return { iconUrl: null, warning: "Missing resource URL for icon resolution" };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { iconUrl: null, warning: "Resource URL is not HTTP(S); skipped icon resolution" };
    }

    const faviconUrl = `${parsed.origin}/favicon.ico`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(faviconUrl, {
        method: "HEAD",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; RutaSec-Proposal-Intake/1.0)" },
      });

      if (response.ok && faviconUrl.startsWith("https://")) {
        return { iconUrl: faviconUrl, warning: null };
      }
    } catch {
      // Fall through to templated favicon URL.
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return { iconUrl: null, warning: "Invalid resource URL for icon resolution" };
  }

  const fallback = resolveResourceIconUrl(trimmed);
  if (!fallback) {
    return { iconUrl: null, warning: "Could not resolve icon_url; review manually before seeding" };
  }

  return { iconUrl: fallback, warning: null };
}
