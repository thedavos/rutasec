import type { ResourceType } from "#/modules/catalog/domain/entities/resource";

export const PROPOSAL_FORMAT_SLUGS: Record<ResourceType, string> = {
  course: "course",
  book: "book",
  documentation: "documentation",
  video: "video",
  lab: "lab",
  tool: "tool",
  article: "article",
};

export const PROPOSAL_FORMAT_LABELS: Record<ResourceType, string> = {
  course: "Course",
  book: "Book",
  documentation: "Documentation",
  video: "Video",
  lab: "Lab",
  tool: "Tool",
  article: "Article",
};

export const PROPOSAL_FORMAT_BY_SLUG = Object.fromEntries(
  Object.entries(PROPOSAL_FORMAT_SLUGS).map(([type, slug]) => [slug, type]),
) as Record<string, ResourceType>;

export const PROPOSAL_FORMAT_BY_LABEL = Object.fromEntries(
  Object.entries(PROPOSAL_FORMAT_LABELS).map(([type, label]) => [label.toLowerCase(), type]),
) as Record<string, ResourceType>;

export const PROPOSAL_LANGUAGE_LABELS = {
  en: "English",
  es: "Spanish",
} as const;

export const PROPOSAL_TITLE_PREFIX_PATTERN =
  /^\[new-(course|book|documentation|video|lab|tool|article)\]\s*(.*)$/i;
