import { fetchGitHubIssue } from "./fetch-github-issue";
import {
  githubHeaders,
  githubIssueCommentsUrl,
  githubIssueUrl,
  readGitHubError,
} from "./github-api";

export type CloseGitHubProposalIssueInput = {
  issueNumber: number;
  token: string;
  comment?: string;
  dryRun?: boolean;
};

export type CloseGitHubProposalIssueResult = {
  issueNumber: number;
  title: string;
  wasOpen: boolean;
  commentPosted: boolean;
};

async function postIssueComment(issueNumber: number, body: string, token: string): Promise<void> {
  const response = await fetch(githubIssueCommentsUrl(issueNumber), {
    method: "POST",
    headers: {
      ...githubHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error ${response.status} posting comment on issue #${issueNumber}: ${await readGitHubError(response)}`,
    );
  }
}

async function closeIssue(issueNumber: number, token: string): Promise<void> {
  const response = await fetch(githubIssueUrl(issueNumber), {
    method: "PATCH",
    headers: {
      ...githubHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      state: "closed",
      state_reason: "completed",
    }),
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error ${response.status} closing issue #${issueNumber}: ${await readGitHubError(response)}`,
    );
  }
}

export async function closeGitHubProposalIssue(
  input: CloseGitHubProposalIssueInput,
): Promise<CloseGitHubProposalIssueResult> {
  const { issueNumber, token, comment, dryRun = false } = input;
  const issue = await fetchGitHubIssue(issueNumber, token);

  if (issue.state === "closed") {
    return {
      issueNumber: issue.number,
      title: issue.title,
      wasOpen: false,
      commentPosted: false,
    };
  }

  if (dryRun) {
    return {
      issueNumber: issue.number,
      title: issue.title,
      wasOpen: true,
      commentPosted: Boolean(comment?.trim()),
    };
  }

  if (comment?.trim()) {
    await postIssueComment(issueNumber, comment.trim(), token);
  }

  await closeIssue(issueNumber, token);

  return {
    issueNumber: issue.number,
    title: issue.title,
    wasOpen: true,
    commentPosted: Boolean(comment?.trim()),
  };
}
