import type { ResourceType } from "#/modules/catalog/domain/entities/resource";
import type {
  ProposalLanguage,
  ResourceProposalConfirmations,
} from "#/modules/catalog/domain/entities/resource-proposal";
import {
  PROPOSAL_FORMAT_BY_LABEL,
  PROPOSAL_FORMAT_BY_SLUG,
  PROPOSAL_LANGUAGE_LABELS,
  PROPOSAL_TITLE_PREFIX_PATTERN,
} from "#/shared/constants/proposal-format";

export type ParsedProposal = {
  issueNumber?: number;
  issueTitle?: string;
  url: string;
  title: string;
  authorOrProject: string;
  category: string;
  format: ResourceType;
  language: ProposalLanguage;
  notes: string;
  confirmations: ResourceProposalConfirmations;
};

export type ParseResourceProposalIssueResult =
  | { ok: true; value: ParsedProposal }
  | { ok: false; errors: string[] };

const REQUIRED_SECTIONS = [
  "Resource details",
  "Confirmations",
  "Why it should be in the catalog",
  "Maintainer checklist",
] as const;

function splitSections(body: string): Map<string, string> {
  const sections = new Map<string, string>();
  const parts = body.split(/^## /m);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) {
      continue;
    }

    const newlineIndex = trimmed.indexOf("\n");
    const heading = newlineIndex === -1 ? trimmed : trimmed.slice(0, newlineIndex).trim();
    const content = newlineIndex === -1 ? "" : trimmed.slice(newlineIndex + 1).trim();
    sections.set(heading, content);
  }

  return sections;
}

function parseDetailBullet(line: string): { label: string; value: string } | null {
  const match = line.match(/^- \*\*(.+?):\*\* (.*)$/);
  if (!match) {
    return null;
  }

  return { label: match[1], value: match[2] };
}

function parseCheckbox(line: string): { checked: boolean; label: string } | null {
  const match = line.match(/^- \[([ xX])\] (.+)$/);
  if (!match) {
    return null;
  }

  return { checked: match[1].toLowerCase() === "x", label: match[2] };
}

export function parseFormatFromIssueTitle(issueTitle: string): ResourceType | null {
  const match = issueTitle.match(PROPOSAL_TITLE_PREFIX_PATTERN);
  if (!match) {
    return null;
  }

  return PROPOSAL_FORMAT_BY_SLUG[match[1].toLowerCase()] ?? null;
}

function parseFormatLabel(label: string): ResourceType | null {
  return PROPOSAL_FORMAT_BY_LABEL[label.trim().toLowerCase()] ?? null;
}

function parseLanguageLabel(label: string): ProposalLanguage | null {
  const normalized = label.trim().toLowerCase();
  if (normalized === PROPOSAL_LANGUAGE_LABELS.en.toLowerCase()) {
    return "en";
  }
  if (normalized === PROPOSAL_LANGUAGE_LABELS.es.toLowerCase()) {
    return "es";
  }
  return null;
}

function parseConfirmations(content: string): ResourceProposalConfirmations {
  const confirmations: ResourceProposalConfirmations = {
    isFree: false,
    isEnglishOrSpanish: false,
  };

  for (const line of content.split("\n")) {
    const checkbox = parseCheckbox(line.trim());
    if (!checkbox) {
      continue;
    }

    if (checkbox.label.startsWith("It is free")) {
      confirmations.isFree = checkbox.checked;
    }

    if (
      checkbox.label === "It is in English" ||
      checkbox.label === "It is in Spanish" ||
      checkbox.label.startsWith("It is in English") ||
      checkbox.label.startsWith("It is in Spanish")
    ) {
      confirmations.isEnglishOrSpanish = checkbox.checked;
    }
  }

  return confirmations;
}

export function parseResourceProposalIssueBody(
  body: string,
  options?: { issueNumber?: number; issueTitle?: string },
): ParseResourceProposalIssueResult {
  const errors: string[] = [];
  const sections = splitSections(body);

  for (const section of REQUIRED_SECTIONS) {
    if (!sections.has(section)) {
      errors.push(`Missing section: ${section}`);
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const details = sections.get("Resource details") ?? "";
  const detailFields: Record<string, string> = {};

  for (const line of details.split("\n")) {
    const bullet = parseDetailBullet(line.trim());
    if (bullet) {
      detailFields[bullet.label] = bullet.value;
    }
  }

  const titleFromDetails = detailFields.Title ?? "";
  const url = detailFields.Link?.trim() ?? "";
  const category = detailFields["Suggested category"]?.trim() ?? "";
  const authorOrProject = detailFields["Author or project"]?.trim() ?? "";

  let format = options?.issueTitle ? parseFormatFromIssueTitle(options.issueTitle) : null;
  if (!format && detailFields.Format) {
    format = parseFormatLabel(detailFields.Format);
  }

  const language = detailFields.Language ? parseLanguageLabel(detailFields.Language) : null;

  if (!url) {
    errors.push("Missing field: Link");
  }
  if (!titleFromDetails && !options?.issueTitle) {
    errors.push("Missing field: Title");
  }
  if (!category) {
    errors.push("Missing field: Suggested category");
  }
  if (!format) {
    errors.push("Missing or invalid format");
  }
  if (!language) {
    errors.push("Missing or invalid language");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const notesRaw = sections.get("Why it should be in the catalog")?.trim() ?? "";
  const notes = notesRaw === "No additional note." ? "" : notesRaw;

  const titleFromIssue = options?.issueTitle?.match(PROPOSAL_TITLE_PREFIX_PATTERN)?.[2]?.trim();
  const title = titleFromDetails || titleFromIssue || "";

  if (!title) {
    return { ok: false, errors: ["Missing field: Title"] };
  }

  const normalizedAuthor =
    authorOrProject === "Not specified" || !authorOrProject ? "" : authorOrProject;

  return {
    ok: true,
    value: {
      issueNumber: options?.issueNumber,
      issueTitle: options?.issueTitle,
      url,
      title,
      authorOrProject: normalizedAuthor,
      category,
      format: format!,
      language: language!,
      notes,
      confirmations: parseConfirmations(sections.get("Confirmations") ?? ""),
    },
  };
}
