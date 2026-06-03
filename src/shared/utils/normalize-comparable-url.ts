export function normalizeComparableUrl(url: string): string {
  const trimmed = url.trim().toLowerCase();
  if (!trimmed) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.host.replace(/^www\./, "");
    const pathname = parsed.pathname.replace(/\/$/, "") || "";
    const search = parsed.search;

    return `${host}${pathname}${search}`;
  } catch {
    return trimmed.replace(/\/$/, "");
  }
}
