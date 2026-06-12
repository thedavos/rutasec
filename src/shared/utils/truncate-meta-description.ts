const DEFAULT_META_DESCRIPTION_MAX_LENGTH = 160;

export function truncateMetaDescription(
  value: string | null | undefined,
  maxLength = DEFAULT_META_DESCRIPTION_MAX_LENGTH,
): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  const truncated = trimmed.slice(0, maxLength - 1).trimEnd();
  return `${truncated}…`;
}
