import { PROPOSAL_TITLE_PREFIX_PATTERN } from "#/shared/constants/proposal-format";

import { githubHeaders, githubIssueUrl, readGitHubError } from "./github-api";

export type GitHubIssue = {
  number: number;
  title: string;
  body: string | null;
  state: string;
};

export function isProposalIssueTitle(title: string): boolean {
  return PROPOSAL_TITLE_PREFIX_PATTERN.test(title);
}

export async function fetchGitHubIssue(issueNumber: number, token: string): Promise<GitHubIssue> {
  const response = await fetch(githubIssueUrl(issueNumber), {
    headers: githubHeaders(token),
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error ${response.status} for issue #${issueNumber}: ${await readGitHubError(response)}`,
    );
  }

  const issue = (await response.json()) as GitHubIssue;

  if (!isProposalIssueTitle(issue.title)) {
    throw new Error(
      `Issue #${issueNumber} title does not match proposal format [new-<type>]: ${issue.title}`,
    );
  }

  if (!issue.body?.trim()) {
    throw new Error(`Issue #${issueNumber} has an empty body`);
  }

  return issue;
}
