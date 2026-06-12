import { PROPOSAL_TITLE_PREFIX_PATTERN } from "#/shared/constants/proposal-format";

const GITHUB_REPO = "thedavos/rutasec";

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
  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/issues/${issueNumber}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "rutasec-proposal-intake",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API error ${response.status} for issue #${issueNumber}: ${body}`);
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
