#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(projectRoot, "db/seed/community-logos.json");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function usage() {
  console.log(`Usage:
  npm run proposal:set-icon -- <issue-number> <community-slug>
  npm run proposal:set-icon -- <issue-number> --icon-path /community-icons/<slug>.<ext>

Examples:
  npm run proposal:set-icon -- 42 acme-security
  npm run proposal:set-icon -- 42 --icon-path /community-icons/acme-security.svg

Looks up icon_path in db/seed/community-logos.json when a slug is provided.
Updates db/seed/proposals/issue-<number>.json (bare seed resource object).
`);
}

function parseArgs(argv) {
  let iconPath = null;
  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }
    if (arg === "--icon-path") {
      iconPath = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }
    positional.push(arg);
  }

  const issueNumber = Number(positional[0]);
  const communitySlug = positional[1];

  if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
    throw new Error("Provide a positive GitHub issue number");
  }

  if (!iconPath && !communitySlug) {
    throw new Error("Provide <community-slug> or --icon-path");
  }

  if (communitySlug && !SLUG_PATTERN.test(communitySlug)) {
    throw new Error(
      `Invalid slug "${communitySlug}". Use lowercase letters, numbers, and hyphens only.`,
    );
  }

  return { issueNumber, communitySlug: communitySlug ?? null, iconPath };
}

async function readManifest() {
  const raw = await fs.readFile(manifestPath, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed.communities || typeof parsed.communities !== "object") {
    throw new Error("Invalid community-logos.json shape");
  }
  return parsed;
}

async function resolveIconPath({ communitySlug, iconPath }) {
  if (iconPath) {
    if (!iconPath.startsWith("/community-icons/")) {
      throw new Error('icon_path must start with "/community-icons/"');
    }
    return iconPath;
  }

  const manifest = await readManifest();
  const entry = manifest.communities[communitySlug];
  if (!entry?.icon_path) {
    throw new Error(
      `No icon_path for slug "${communitySlug}" in db/seed/community-logos.json. Run community-icon:import first.`,
    );
  }

  return entry.icon_path;
}

async function assertIconFileExists(iconPath) {
  const relative = iconPath.replace(/^\//, "");
  const filePath = path.join(projectRoot, "public", relative);
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`Icon file not found at public/${relative}`);
  }
}

async function main() {
  const {
    issueNumber,
    communitySlug,
    iconPath: explicitIconPath,
  } = parseArgs(process.argv.slice(2));

  const iconPath = await resolveIconPath({
    communitySlug,
    iconPath: explicitIconPath,
  });

  await assertIconFileExists(iconPath);

  const proposalRelative = `db/seed/proposals/issue-${issueNumber}.json`;
  const proposalPath = path.join(projectRoot, proposalRelative);

  let raw;
  try {
    raw = await fs.readFile(proposalPath, "utf8");
  } catch {
    throw new Error(`Proposal file not found: ${proposalRelative}`);
  }

  const resource = JSON.parse(raw);
  if (!resource || typeof resource !== "object" || Array.isArray(resource)) {
    throw new Error(`${proposalRelative} must contain a JSON object`);
  }

  resource.icon_url = iconPath;
  await fs.writeFile(proposalPath, `${JSON.stringify(resource, null, 2)}\n`, "utf8");

  console.log(`Updated ${proposalRelative}`);
  console.log(`  icon_url: ${iconPath}`);
  if (communitySlug) {
    console.log(`  community: ${communitySlug}`);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Set proposal icon failed: ${message}`);
  process.exit(1);
});
