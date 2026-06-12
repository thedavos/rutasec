import { Agent, CursorAgentError } from "@cursor/sdk";

import type { ParsedProposal } from "#/shared/utils/parse-resource-proposal-issue-body";
import { RUTASEC_GITHUB_URL } from "#/shared/constants/rutasec-github";

import type { SeedContext } from "./load-seed-context";
import { seedResourceSchema, type SeedResource } from "./seed-resource-schema";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function extractJsonObject(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Cursor agent response did not contain a JSON object");
  }

  return text.slice(start, end + 1);
}

function buildPrompt(proposal: ParsedProposal, context: SeedContext): string {
  return `You enrich RutaSec catalog seed resources from a community proposal.

Return ONLY a single JSON object. No markdown fences, no commentary.

Proposal fields (trust these over your guesses when they conflict):
${JSON.stringify(
  {
    url: proposal.url,
    title: proposal.title,
    authorOrProject: proposal.authorOrProject,
    category: proposal.category,
    resource_type: proposal.format,
    language: proposal.language,
    notes: proposal.notes,
  },
  null,
  2,
)}

Existing seed categories: ${context.categories.join(", ")}
Existing seed topics (sample): ${context.topics.slice(0, 20).join(", ")}
Existing seed phases: ${context.phases.join(", ")}
Suggested path_order: ${context.nextPathOrder}

Required JSON shape:
{
  "id": "res-<slug>",
  "title": string,
  "description": string,
  "url": string,
  "phase": string,
  "category": string,
  "topic": string,
  "subtopic": string,
  "resource_type": "course"|"book"|"documentation"|"video"|"lab"|"tool"|"article",
  "level": "beginner"|"intermediate"|"advanced",
  "estimated_hours": number,
  "original_source_name": string,
  "original_source_url": string,
  "curated_from_name": "RutaSec",
  "curated_from_url": "${RUTASEC_GITHUB_URL}",
  "roadmap_section": string,
  "is_free": true,
  "language": "en"|"es",
  "tags": string[],
  "path_order": number
}

Rules:
- tags must include exactly one of: theory, practice, mixed (lowercase) plus 1-3 topical tags.
- Use the proposal category when it fits an existing category; otherwise keep the suggested category.
- description should be 1-2 sentences in the proposal language (${proposal.language}).
- original_source_url should match url unless there is a clearer canonical source URL.
- original_source_name should use authorOrProject when present, otherwise infer from the site name.
- roadmap_section format: "<phase> > <category> > <topic>".
- path_order must be ${context.nextPathOrder} unless you have a strong reason to pick another unused integer.
- Do not include icon_url (added separately).`;
}

export async function enrichProposalWithCursor(
  proposal: ParsedProposal,
  context: SeedContext,
  options: { apiKey: string; cwd: string },
): Promise<SeedResource> {
  const issueSuffix = proposal.issueNumber ? String(proposal.issueNumber) : slugify(proposal.title);

  try {
    const result = await Agent.prompt(buildPrompt(proposal, context), {
      apiKey: options.apiKey,
      model: { id: "composer-2.5" },
      local: { cwd: options.cwd },
    });

    if (result.status === "error") {
      throw new Error(`Cursor agent run failed: ${result.id}`);
    }

    const rawText =
      typeof result.result === "string" ? result.result : JSON.stringify(result.result);
    const parsed = seedResourceSchema.parse(JSON.parse(extractJsonObject(rawText)));

    const merged: SeedResource = {
      ...parsed,
      url: proposal.url,
      title: proposal.title,
      resource_type: proposal.format,
      language: proposal.language,
      is_free: true,
      curated_from_name: "RutaSec",
      curated_from_url: RUTASEC_GITHUB_URL,
      id: parsed.id || `res-proposal-${issueSuffix}`,
      path_order: parsed.path_order || context.nextPathOrder,
    };

    if (proposal.authorOrProject) {
      merged.original_source_name = proposal.authorOrProject;
    }

    if (proposal.notes && !merged.description?.trim()) {
      merged.description = proposal.notes;
    }

    return seedResourceSchema.parse(merged);
  } catch (error) {
    if (error instanceof CursorAgentError) {
      throw new Error(`Cursor SDK startup failed: ${error.message}`);
    }
    throw error;
  }
}
