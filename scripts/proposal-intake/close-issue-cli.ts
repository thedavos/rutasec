#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { buildProposalCloseComment } from "#/shared/utils/build-proposal-close-comment";

import { closeGitHubProposalIssue } from "./close-github-issue";
import { resolveGitHubToken } from "./github-auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

function usage(): void {
  console.log(`Usage:
  npm run proposal:close -- <issue-number> [options]

Options:
  --comment <text>     Custom closing comment (default: acceptance message)
  --resource-id <id>   Include catalog resource id in the default comment
  --no-comment         Close without posting a comment
  --dry-run            Validate only; do not post or close
  --help               Show this help

Environment:
  GITHUB_TOKEN         GitHub API token (or use \`gh auth token\`)

Examples:
  npm run proposal:close -- 42
  npm run proposal:close -- 42 --resource-id res-video-example
  npm run proposal:close -- 42 --no-comment
  npm run proposal:close -- 42 --dry-run
`);
}

function parseArgs(argv: string[]) {
  let issueNumber: number | null = null;
  let comment: string | undefined;
  let resourceId: string | undefined;
  let noComment = false;
  let dryRun = false;
  let commentProvided = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }
    if (arg === "--comment") {
      comment = argv[i + 1];
      commentProvided = true;
      i += 1;
      continue;
    }
    if (arg === "--resource-id") {
      resourceId = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--no-comment") {
      noComment = true;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }
    if (issueNumber === null) {
      issueNumber = Number(arg);
    }
  }

  if (!Number.isInteger(issueNumber) || issueNumber! <= 0) {
    throw new Error("Provide a positive GitHub issue number");
  }

  if (noComment && commentProvided) {
    throw new Error("Use either --comment or --no-comment, not both");
  }

  return {
    issueNumber: issueNumber!,
    comment,
    resourceId,
    noComment,
    dryRun,
    commentProvided,
  };
}

async function loadProposalResourceId(issueNumber: number): Promise<string | undefined> {
  const proposalPath = path.join(projectRoot, `db/seed/proposals/issue-${issueNumber}.json`);

  try {
    const raw = await fs.readFile(proposalPath, "utf8");
    const resource = JSON.parse(raw) as { id?: string };
    return typeof resource.id === "string" ? resource.id : undefined;
  } catch {
    return undefined;
  }
}

async function resolveCloseComment(options: {
  issueNumber: number;
  comment?: string;
  resourceId?: string;
  noComment: boolean;
  commentProvided: boolean;
}): Promise<string | undefined> {
  if (options.noComment) {
    return undefined;
  }

  if (options.commentProvided) {
    return options.comment;
  }

  const resourceId =
    options.resourceId?.trim() || (await loadProposalResourceId(options.issueNumber));

  return buildProposalCloseComment(resourceId);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const token = resolveGitHubToken();
  const comment = await resolveCloseComment(args);

  const result = await closeGitHubProposalIssue({
    issueNumber: args.issueNumber,
    token,
    comment,
    dryRun: args.dryRun,
  });

  if (!result.wasOpen) {
    console.log(`Issue #${result.issueNumber} is already closed: ${result.title}`);
    return;
  }

  if (args.dryRun) {
    console.log(`Dry run OK: would close issue #${result.issueNumber}: ${result.title}`);
    if (comment) {
      console.log("");
      console.log("Comment:");
      console.log(comment);
    } else {
      console.log("No comment would be posted.");
    }
    return;
  }

  console.log(`Closed issue #${result.issueNumber}: ${result.title}`);
  if (result.commentPosted) {
    console.log("Posted closing comment.");
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Proposal close failed: ${message}`);
  process.exit(1);
});
