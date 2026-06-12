import { describe, expect, it } from "vite-plus/test";

import {
  buildResourceProposalIssue,
  validateResourceProposal,
} from "#/modules/catalog/domain/build-resource-proposal-issue";
import type { ResourceProposalInput } from "#/modules/catalog/domain/entities/resource-proposal";
import {
  parseFormatFromIssueTitle,
  parseResourceProposalIssueBody,
} from "#/shared/utils/parse-resource-proposal-issue-body";

const validInput: ResourceProposalInput = {
  url: "https://example.com/resource",
  title: "Intro to Web Pentesting",
  authorOrProject: "OWASP",
  category: "Web Application Security",
  format: "course",
  language: "en",
  notes: "Great starter material.",
  confirmations: {
    isFree: true,
    isEnglishOrSpanish: true,
  },
};

describe("parseFormatFromIssueTitle", () => {
  it("reads the format slug from proposal titles", () => {
    expect(parseFormatFromIssueTitle("[new-course] Intro to Web Pentesting")).toBe("course");
    expect(parseFormatFromIssueTitle("[new-book] Security Reading")).toBe("book");
  });

  it("returns null for non-proposal titles", () => {
    expect(parseFormatFromIssueTitle("Random issue")).toBeNull();
  });
});

describe("parseResourceProposalIssueBody", () => {
  it("round-trips bodies built by buildResourceProposalIssue", () => {
    const issue = buildResourceProposalIssue(validInput);
    const parsed = parseResourceProposalIssueBody(issue.bodyMarkdown, {
      issueNumber: 42,
      issueTitle: issue.title,
    });

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    expect(parsed.value).toMatchObject({
      issueNumber: 42,
      issueTitle: issue.title,
      url: validInput.url,
      title: validInput.title,
      authorOrProject: validInput.authorOrProject,
      category: validInput.category,
      format: validInput.format,
      language: validInput.language,
      notes: validInput.notes,
      confirmations: validInput.confirmations,
    });
  });

  it("handles Spanish confirmations and empty author", () => {
    const input: ResourceProposalInput = {
      ...validInput,
      language: "es",
      authorOrProject: "   ",
      notes: "   ",
    };
    const issue = buildResourceProposalIssue(input);
    const parsed = parseResourceProposalIssueBody(issue.bodyMarkdown, { issueTitle: issue.title });

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    expect(parsed.value.language).toBe("es");
    expect(parsed.value.authorOrProject).toBe("");
    expect(parsed.value.notes).toBe("");
    expect(parsed.value.confirmations.isEnglishOrSpanish).toBe(true);
  });

  it("reports missing sections", () => {
    const result = parseResourceProposalIssueBody("## Resource details\n\n- **Title:** x");
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.errors.some((error) => error.includes("Confirmations"))).toBe(true);
  });

  it("rejects bodies that fail validation fields", () => {
    const incomplete = buildResourceProposalIssue({
      ...validInput,
      url: "",
      category: "",
    });
    const result = parseResourceProposalIssueBody(incomplete.bodyMarkdown, {
      issueTitle: incomplete.title,
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("keeps pipe characters in parsed detail fields", () => {
    const input: ResourceProposalInput = {
      ...validInput,
      title: "A | B",
      authorOrProject: "Team | Project",
      category: "Web | Security",
    };
    const issue = buildResourceProposalIssue(input);
    const parsed = parseResourceProposalIssueBody(issue.bodyMarkdown, { issueTitle: issue.title });

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    expect(parsed.value.title).toBe("A | B");
    expect(parsed.value.authorOrProject).toBe("Team | Project");
    expect(parsed.value.category).toBe("Web | Security");
  });

  it("parses format and language from the body when issue title is omitted", () => {
    const issue = buildResourceProposalIssue({ ...validInput, format: "video", language: "es" });
    const parsed = parseResourceProposalIssueBody(issue.bodyMarkdown);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    expect(parsed.value.format).toBe("video");
    expect(parsed.value.language).toBe("es");
  });

  it("uses the title from the issue prefix when the detail title is empty", () => {
    const issue = buildResourceProposalIssue({ ...validInput, title: "" });
    const parsed = parseResourceProposalIssueBody(issue.bodyMarkdown, {
      issueTitle: "[new-article] Prefix title only",
    });

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    expect(parsed.value.title).toBe("Prefix title only");
    expect(parsed.value.format).toBe("article");
  });

  it("reports missing link and category fields", () => {
    const issue = buildResourceProposalIssue({
      ...validInput,
      url: "https://example.com",
      category: "Web Application Security",
    });
    const brokenBody = issue.bodyMarkdown
      .replace("- **Link:** https://example.com", "- **Link:** ")
      .replace("- **Suggested category:** Web Application Security", "- **Suggested category:** ");

    const parsed = parseResourceProposalIssueBody(brokenBody, { issueTitle: issue.title });
    expect(parsed.ok).toBe(false);
    if (parsed.ok) {
      return;
    }

    expect(parsed.errors).toEqual(
      expect.arrayContaining(["Missing field: Link", "Missing field: Suggested category"]),
    );
  });

  it("aligns with validateResourceProposal on complete proposals", () => {
    const issue = buildResourceProposalIssue(validInput);
    const parsed = parseResourceProposalIssueBody(issue.bodyMarkdown, { issueTitle: issue.title });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    const validation = validateResourceProposal({
      url: parsed.value.url,
      title: parsed.value.title,
      authorOrProject: parsed.value.authorOrProject,
      category: parsed.value.category,
      format: parsed.value.format,
      language: parsed.value.language,
      notes: parsed.value.notes,
      confirmations: parsed.value.confirmations,
    });

    expect(validation.ok).toBe(true);
  });
});
