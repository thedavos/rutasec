import { normalizeComparableText } from "#/shared/utils/normalize-comparable-text";
import { normalizeComparableUrl } from "#/shared/utils/normalize-comparable-url";

export type NamedSource = {
  name: string;
  url: string;
};

export function areNamedSourcesEqual(left: NamedSource, right: NamedSource): boolean {
  return (
    normalizeComparableText(left.name) === normalizeComparableText(right.name) &&
    normalizeComparableUrl(left.url) === normalizeComparableUrl(right.url)
  );
}
