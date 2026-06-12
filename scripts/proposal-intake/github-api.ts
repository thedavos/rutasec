import { RUTASEC_GITHUB_REPO } from "#/shared/constants/rutasec-github";

export function githubIssueUrl(issueNumber: number): string {
  return `https://api.github.com/repos/${RUTASEC_GITHUB_REPO}/issues/${issueNumber}`;
}

export function githubIssueCommentsUrl(issueNumber: number): string {
  return `${githubIssueUrl(issueNumber)}/comments`;
}

export function githubHeaders(token: string): Record<string, string> {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "rutasec-proposal-intake",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function readGitHubError(response: Response): Promise<string> {
  const body = await response.text();
  return body.trim() || response.statusText;
}
