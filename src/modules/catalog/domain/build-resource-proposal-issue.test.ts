import { describe, expect, it } from "vite-plus/test";

import {
  buildResourceProposalIssue,
  isValidHttpUrl,
  validateResourceProposal,
} from "#/modules/catalog/domain/build-resource-proposal-issue";
import type { ResourceProposalInput } from "#/modules/catalog/domain/entities/resource-proposal";
import { RUTASEC_GITHUB_ISSUES_NEW_URL } from "#/shared/constants/rutasec-github";

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
      expect(result.value.authorOrProject).toBe("OWASP");
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
  it("builds an English issue title, body, and encoded issue URL", () => {
    const issue = buildResourceProposalIssue(validInput);

    expect(issue.title).toBe("[new-course] Intro to Web Pentesting");
    expect(issue.bodyMarkdown).toContain("## Resource details");
    expect(issue.bodyMarkdown).toContain("- **Title:** Intro to Web Pentesting");
    expect(issue.bodyMarkdown).toContain("- **Author or project:** OWASP");
    expect(issue.bodyMarkdown).toContain("- **Link:** https://example.com/resource");
    expect(issue.bodyMarkdown).toContain("- **Suggested category:** Web Application Security");
    expect(issue.bodyMarkdown).toContain("- **Format:** Course");
    expect(issue.bodyMarkdown).toContain("- **Language:** English");
    expect(issue.bodyMarkdown).toContain("- [x] It is free, with no paywall or trial");
    expect(issue.bodyMarkdown).toContain("- [x] It is in English");
    expect(issue.bodyMarkdown).toContain("Great starter material.");
    expect(issue.bodyMarkdown).toContain("## Maintainer checklist");
    expect(issue.bodyMarkdown).toContain("- [ ] The resource is free and legal");
    expect(issue.issueUrl).toContain(`${RUTASEC_GITHUB_ISSUES_NEW_URL}?`);
    expect(issue.issueUrl).toContain(encodeURIComponent(issue.title));
    expect(issue.issueUrl).toContain(encodeURIComponent(issue.bodyMarkdown));
  });

  it("uses the book slug in the issue title", () => {
    const issue = buildResourceProposalIssue({ ...validInput, format: "book" });
    expect(issue.title).toBe("[new-book] Intro to Web Pentesting");
    expect(issue.bodyMarkdown).toContain("- **Format:** Book");
  });

  it("uses a placeholder when author or project is empty", () => {
    const issue = buildResourceProposalIssue({ ...validInput, authorOrProject: "   " });
    expect(issue.bodyMarkdown).toContain("- **Author or project:** Not specified");
  });

  it("keeps pipe characters readable without generating markdown table cells", () => {
    const issue = buildResourceProposalIssue({
      ...validInput,
      title: "A | B",
      authorOrProject: "Team | Project",
      category: "Web | Security",
    });

    expect(issue.bodyMarkdown).toContain("- **Title:** A | B");
    expect(issue.bodyMarkdown).toContain("- **Author or project:** Team | Project");
    expect(issue.bodyMarkdown).toContain("- **Suggested category:** Web | Security");
    expect(issue.bodyMarkdown).not.toContain("| Field | Value |");
  });

  it("escapes special characters in the GitHub issue URL", () => {
    const issue = buildResourceProposalIssue({
      ...validInput,
      title: "SQL & XSS 101",
      notes: "Line one\nLine two",
    });

    expect(issue.issueUrl).toContain(encodeURIComponent("[new-course] SQL & XSS 101"));
    expect(issue.bodyMarkdown).toContain("Line one\nLine two");
  });

  it("uses a placeholder when notes are empty", () => {
    const issue = buildResourceProposalIssue({ ...validInput, notes: "   " });
    expect(issue.bodyMarkdown).toContain("No additional note.");
  });

  it("uses unchecked confirmations and a fallback title before the form is complete", () => {
    const issue = buildResourceProposalIssue({
      ...validInput,
      title: "",
      confirmations: {
        isFree: false,
        isEnglishOrSpanish: false,
      },
    });

    expect(issue.title).toBe("[new-course] New free resource");
    expect(issue.bodyMarkdown).toContain("- **Title:** ");
    expect(issue.bodyMarkdown).toContain("- [ ] It is free, with no paywall or trial");
    expect(issue.bodyMarkdown).toContain("- [ ] It is in English");
  });
});
