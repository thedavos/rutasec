import { RESOURCE_TYPES, type ResourceType } from "#/modules/catalog/domain/entities/resource";
import type {
  ProposalLanguage,
  ResourceProposalField,
  ResourceProposalInput,
  ResourceProposalIssue,
  ResourceProposalValidation,
} from "#/modules/catalog/domain/entities/resource-proposal";
import { RUTASEC_GITHUB_ISSUES_NEW_URL } from "#/shared/constants/rutasec-github";

const PROPOSAL_FORMAT_SLUGS: Record<ResourceType, string> = {
  course: "course",
  book: "book",
  documentation: "documentation",
  video: "video",
  lab: "lab",
  tool: "tool",
  article: "article",
};

const PROPOSAL_FORMAT_LABELS: Record<ResourceType, string> = {
  course: "Course",
  book: "Book",
  documentation: "Documentation",
  video: "Video",
  lab: "Lab",
  tool: "Tool",
  article: "Article",
};

const PROPOSAL_LANGUAGE_LABELS: Record<ProposalLanguage, string> = {
  en: "English",
  es: "Spanish",
};

const MAINTAINER_CHECKLIST = [
  "The resource is free and legal",
  "It is available in English or Spanish",
  "It is not a standalone blog post",
  "It fits the suggested category or was adjusted to another",
  "It does not duplicate an existing entry except new edition/translation",
] as const;

function confirmationCheckbox(checked: boolean, label: string): string {
  return `- [${checked ? "x" : " "}] ${label}`;
}

function languageConfirmationLabel(language: ProposalLanguage): string {
  return language === "es" ? "It is in Spanish" : "It is in English";
}

function authorOrProjectLabel(authorOrProject: string): string {
  const trimmed = authorOrProject.trim();
  return trimmed.length > 0 ? trimmed : "Not specified";
}

export function isValidHttpUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateResourceProposal(raw: ResourceProposalInput): ResourceProposalValidation {
  const errors: Partial<Record<ResourceProposalField, string>> = {};

  const url = raw.url.trim();
  if (!url) {
    errors.url = "url_required";
  } else if (!isValidHttpUrl(url)) {
    errors.url = "url_invalid";
  }

  const title = raw.title.trim();
  if (!title) {
    errors.title = "title_required";
  }

  const category = raw.category.trim();
  if (!category) {
    errors.category = "category_required";
  }

  if (!RESOURCE_TYPES.includes(raw.format)) {
    errors.format = "format_required";
  }

  if (raw.language !== "en" && raw.language !== "es") {
    errors.language = "language_required";
  }

  if (!raw.confirmations.isFree) {
    errors.confirmations = "confirm_free";
  } else if (!raw.confirmations.isEnglishOrSpanish) {
    errors.confirmations = "confirm_language";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      url,
      title,
      authorOrProject: raw.authorOrProject.trim(),
      category,
      format: raw.format,
      language: raw.language,
      notes: raw.notes.trim(),
      confirmations: { ...raw.confirmations },
    },
  };
}

export function buildResourceProposalIssue(input: ResourceProposalInput): ResourceProposalIssue {
  const titleText = input.title.trim();
  const formatSlug = PROPOSAL_FORMAT_SLUGS[input.format] ?? "resource";
  const title = `[new-${formatSlug}] ${titleText || "New free resource"}`;
  const notesSection = input.notes.trim() ? input.notes.trim() : "No additional note.";
  const formatLabel = PROPOSAL_FORMAT_LABELS[input.format] ?? input.format;
  const languageLabel = PROPOSAL_LANGUAGE_LABELS[input.language] ?? input.language;

  const bodyMarkdown = [
    "## Resource details",
    "",
    `- **Title:** ${titleText}`,
    `- **Author or project:** ${authorOrProjectLabel(input.authorOrProject)}`,
    `- **Link:** ${input.url.trim()}`,
    `- **Suggested category:** ${input.category.trim()}`,
    `- **Format:** ${formatLabel}`,
    `- **Language:** ${languageLabel}`,
    "",
    "## Confirmations",
    "",
    confirmationCheckbox(input.confirmations.isFree, "It is free, with no paywall or trial"),
    confirmationCheckbox(
      input.confirmations.isEnglishOrSpanish,
      languageConfirmationLabel(input.language),
    ),
    "",
    "## Why it should be in the catalog",
    "",
    notesSection,
    "",
    "## Maintainer checklist",
    "",
    ...MAINTAINER_CHECKLIST.map((item) => confirmationCheckbox(false, item)),
  ].join("\n");

  const issueUrl = `${RUTASEC_GITHUB_ISSUES_NEW_URL}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(bodyMarkdown)}`;

  return { title, bodyMarkdown, issueUrl };
}

export function isResourceProposalComplete(raw: ResourceProposalInput): boolean {
  return validateResourceProposal(raw).ok;
}
