/**
 * Write-time helper for seed curation and proposal intake.
 * Catalog reads use stored `icon_url`; do not call this from loaders or React.
 */
export function resolveResourceIconUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    const host = parsed.hostname.replace(/^www\./i, "");
    if (!host) {
      return null;
    }

    return `https://icons.duckduckgo.com/ip3/${host}.ico`;
  } catch {
    return null;
  }
}
