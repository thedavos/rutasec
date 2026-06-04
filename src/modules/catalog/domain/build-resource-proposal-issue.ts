import { RESOURCE_TYPES } from "#/modules/catalog/domain/entities/resource";
import type {
  ProposalLanguage,
  ResourceProposalField,
  ResourceProposalInput,
  ResourceProposalIssue,
  ResourceProposalValidation,
} from "#/modules/catalog/domain/entities/resource-proposal";
import { RUTASEC_GITHUB_ISSUES_NEW_URL } from "#/shared/constants/rutasec-github";

const PROPOSAL_LANGUAGE_LABELS: Record<ProposalLanguage, string> = {
  en: "English",
  es: "Spanish",
};

export function escapeMarkdownTableCell(value: string): string {
  return value.replace(/\|/g, "\\|");
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
    errors.url = "Resource URL is required.";
  } else if (!isValidHttpUrl(url)) {
    errors.url = "Enter a valid http or https URL.";
  }

  const title = raw.title.trim();
  if (!title) {
    errors.title = "Title is required.";
  }

  const category = raw.category.trim();
  if (!category) {
    errors.category = "Category is required.";
  }

  if (!RESOURCE_TYPES.includes(raw.format)) {
    errors.format = "Select a format.";
  }

  if (raw.language !== "en" && raw.language !== "es") {
    errors.language = "Select a language.";
  }

  if (!raw.confirmations.isFree) {
    errors.confirmations = "Confirm the resource is free.";
  } else if (!raw.confirmations.isEnglishOrSpanish) {
    errors.confirmations = "Confirm the resource is available in English or Spanish.";
  } else if (!raw.confirmations.doesNotModifyCatalog) {
    errors.confirmations = "Confirm this proposal does not modify the catalog directly.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      url,
      title,
      category,
      format: raw.format,
      language: raw.language,
      notes: raw.notes.trim(),
      confirmations: { ...raw.confirmations },
    },
  };
}

export function buildResourceProposalIssue(input: ResourceProposalInput): ResourceProposalIssue {
  const title = `[Resource proposal] ${input.title.trim()}`;
  const notesSection = input.notes.trim() ? input.notes.trim() : "_No additional notes._";

  const bodyMarkdown = [
    "## Resource proposal",
    "",
    "| Field | Value |",
    "| --- | --- |",
    `| URL | ${escapeMarkdownTableCell(input.url.trim())} |`,
    `| Title | ${escapeMarkdownTableCell(input.title.trim())} |`,
    `| Category | ${escapeMarkdownTableCell(input.category.trim())} |`,
    `| Format | ${escapeMarkdownTableCell(input.format)} |`,
    `| Language | ${escapeMarkdownTableCell(PROPOSAL_LANGUAGE_LABELS[input.language])} |`,
    "",
    "### Notes",
    notesSection,
    "",
    "### Eligibility",
    "- [x] Free resource",
    "- [x] Available in English or Spanish",
    "- [x] Proposal only — does not modify the catalog directly",
  ].join("\n");

  const issueUrl = `${RUTASEC_GITHUB_ISSUES_NEW_URL}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(bodyMarkdown)}`;

  return { title, bodyMarkdown, issueUrl };
}

export function isResourceProposalComplete(raw: ResourceProposalInput): boolean {
  return validateResourceProposal(raw).ok;
}
