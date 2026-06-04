import { describe, expect, it } from "vite-plus/test";

import {
  buildResourceProposalIssue,
  escapeMarkdownTableCell,
  isValidHttpUrl,
  validateResourceProposal,
} from "#/modules/catalog/domain/build-resource-proposal-issue";
import type { ResourceProposalInput } from "#/modules/catalog/domain/entities/resource-proposal";

const validInput: ResourceProposalInput = {
  url: "https://example.com/resource",
  title: "Intro to Web Pentesting",
  category: "Web Application Security",
  format: "course",
  language: "en",
  notes: "Great starter material.",
  confirmations: {
    isFree: true,
    isEnglishOrSpanish: true,
    doesNotModifyCatalog: true,
  },
};

describe("isValidHttpUrl", () => {
  it("accepts http and https URLs", () => {
    expect(isValidHttpUrl("https://example.com/path")).toBe(true);
    expect(isValidHttpUrl("http://example.com")).toBe(true);
  });

  it("rejects invalid URLs", () => {
    expect(isValidHttpUrl("")).toBe(false);
    expect(isValidHttpUrl("not-a-url")).toBe(false);
    expect(isValidHttpUrl("ftp://example.com")).toBe(false);
  });
});

describe("validateResourceProposal", () => {
  it("accepts a complete proposal", () => {
    const result = validateResourceProposal(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.url).toBe("https://example.com/resource");
      expect(result.value.notes).toBe("Great starter material.");
    }
  });

  it("returns errors for missing required fields", () => {
    const result = validateResourceProposal({
      ...validInput,
      url: "",
      title: "  ",
      category: "",
      confirmations: {
        isFree: false,
        isEnglishOrSpanish: false,
        doesNotModifyCatalog: false,
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.url).toBeTruthy();
      expect(result.errors.title).toBeTruthy();
      expect(result.errors.category).toBeTruthy();
      expect(result.errors.confirmations).toBeTruthy();
    }
  });

  it("returns an error for invalid URLs", () => {
    const result = validateResourceProposal({ ...validInput, url: "bad-url" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.url).toBe("Enter a valid http or https URL.");
    }
  });
});

describe("buildResourceProposalIssue", () => {
  it("builds a readable title, body, and encoded issue URL", () => {
    const issue = buildResourceProposalIssue(validInput);

    expect(issue.title).toBe("[Resource proposal] Intro to Web Pentesting");
    expect(issue.bodyMarkdown).toContain("## Resource proposal");
    expect(issue.bodyMarkdown).toContain("| URL | https://example.com/resource |");
    expect(issue.bodyMarkdown).toContain("Great starter material.");
    expect(issue.bodyMarkdown).toContain("- [x] Free resource");
    expect(issue.issueUrl).toContain("https://github.com/thedavos/rutasec/issues/new?");
    expect(issue.issueUrl).toContain(encodeURIComponent(issue.title));
    expect(issue.issueUrl).toContain(encodeURIComponent(issue.bodyMarkdown));
  });

  it("escapes special characters in the GitHub issue URL", () => {
    const issue = buildResourceProposalIssue({
      ...validInput,
      title: "SQL & XSS 101",
      notes: "Line one\nLine two",
    });

    expect(issue.issueUrl).toContain(encodeURIComponent("[Resource proposal] SQL & XSS 101"));
    expect(issue.bodyMarkdown).toContain("Line one\nLine two");
  });

  it("uses a placeholder when notes are empty", () => {
    const issue = buildResourceProposalIssue({ ...validInput, notes: "   " });
    expect(issue.bodyMarkdown).toContain("_No additional notes._");
  });

  it("escapes pipe characters in markdown table cells", () => {
    const issue = buildResourceProposalIssue({
      ...validInput,
      title: "A | B",
      category: "Web | Security",
    });

    expect(issue.bodyMarkdown).toContain("| Title | A \\| B |");
    expect(issue.bodyMarkdown).toContain("| Category | Web \\| Security |");
  });
});

describe("escapeMarkdownTableCell", () => {
  it("escapes pipe characters", () => {
    expect(escapeMarkdownTableCell("a|b")).toBe("a\\|b");
  });
});
