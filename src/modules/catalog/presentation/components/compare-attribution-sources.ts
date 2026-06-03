export function normalizeAttributionName(name: string): string {
  return name.trim().toLowerCase();
}

export function normalizeAttributionUrl(url: string): string {
  const trimmed = url.trim().toLowerCase();
  if (!trimmed) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");
    const pathname = parsed.pathname.replace(/\/$/, "") || "";
    const search = parsed.search;

    return `${host}${pathname}${search}`;
  } catch {
    return trimmed.replace(/\/$/, "");
  }
}

export function areAttributionSourcesEqual(
  original: { name: string; url: string },
  curated: { name: string; url: string },
): boolean {
  return (
    normalizeAttributionName(original.name) === normalizeAttributionName(curated.name) &&
    normalizeAttributionUrl(original.url) === normalizeAttributionUrl(curated.url)
  );
}
