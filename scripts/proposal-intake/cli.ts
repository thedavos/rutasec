#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { parseResourceProposalIssueBody } from "#/shared/utils/parse-resource-proposal-issue-body";

import { enrichProposalWithCursor } from "./enrich-with-cursor";
import { fetchGitHubIssue } from "./fetch-github-issue";
import { resolveGitHubToken } from "./github-auth";
import { assertUrlNotDuplicate, loadSeedContext } from "./load-seed-context";
import { resolveIconUrl } from "./resolve-icon";
import { writeProposalOutput } from "./write-output";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

function usage(): void {
  console.log(`Usage:
  npm run proposal:intake -- <issue-number> [options]

Options:
  --stdout       Print validated seed JSON to stdout instead of writing a file
  --dry-run      Validate and print summary without writing output
  --help         Show this help

Environment:
  GITHUB_TOKEN     GitHub API token (or use \`gh auth token\`)
  CURSOR_API_KEY   Cursor SDK API key for AI enrichment

Output:
  Default: db/seed/proposals/issue-<number>.json (gitignored)

Review the generated resource, then promote and close:

  npm run proposal:promote -- <issue-number>
  npm run proposal:close -- <issue-number>
`);
}

function resolveCursorApiKey(): string {
  const apiKey = process.env.CURSOR_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Set CURSOR_API_KEY before running proposal intake");
  }
  return apiKey;
}

function parseArgs(argv: string[]) {
  let issueNumber: number | null = null;
  let stdout = false;
  let dryRun = false;

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }
    if (arg === "--stdout") {
      stdout = true;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg.startsWith("--issue=")) {
      issueNumber = Number(arg.slice("--issue=".length));
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

  return { issueNumber: issueNumber!, stdout, dryRun };
}

async function main(): Promise<void> {
  const { issueNumber, stdout, dryRun } = parseArgs(process.argv.slice(2));
  const githubToken = resolveGitHubToken();
  const cursorApiKey = resolveCursorApiKey();

  const issue = await fetchGitHubIssue(issueNumber, githubToken);
  const parsed = parseResourceProposalIssueBody(issue.body!, {
    issueNumber: issue.number,
    issueTitle: issue.title,
  });

  if (!parsed.ok) {
    throw new Error(`Failed to parse issue body:\n- ${parsed.errors.join("\n- ")}`);
  }

  const seedContext = await loadSeedContext(projectRoot);
  assertUrlNotDuplicate(parsed.value.url, seedContext);

  const enriched = await enrichProposalWithCursor(parsed.value, seedContext, {
    apiKey: cursorApiKey,
    cwd: projectRoot,
  });

  const icon = await resolveIconUrl(enriched.url);
  const resource = {
    ...enriched,
    ...(icon.iconUrl ? { icon_url: icon.iconUrl } : {}),
  };

  const outputPath = await writeProposalOutput({
    projectRoot,
    issueNumber,
    resource,
    stdout,
    dryRun,
  });

  console.error(`Proposal intake complete for issue #${issueNumber}`);
  console.error(`Title: ${resource.title}`);
  console.error(`Resource id: ${resource.id}`);
  console.error(`path_order: ${resource.path_order}`);
  if (icon.iconUrl) {
    console.error(`icon_url: ${icon.iconUrl}`);
  } else if (icon.warning) {
    console.error(`icon_url warning: ${icon.warning}`);
  }
  if (!stdout) {
    console.error(`Output: ${outputPath}${dryRun ? " (dry run, not written)" : ""}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Proposal intake failed: ${message}`);
  process.exit(1);
});
