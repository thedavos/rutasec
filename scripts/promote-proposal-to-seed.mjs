#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { DEFAULT_PROMOTE_SEED_PATH, EDITORIAL_SEED_PATHS } from "./lib/editorial-seed-paths.mjs";
import { normalizeComparableUrl } from "./lib/normalize-comparable-url.mjs";
import { validateSeed, validateSeedResource } from "./lib/validate-seed.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function usage() {
  console.log(`Usage:
  npm run proposal:promote -- <issue-number> [options]

Options:
  --seed <path>           Target seed file (default: ${DEFAULT_PROMOTE_SEED_PATH})
  --assign-path-order     Set path_order to next free slot in target seed
  --remove-proposal       Delete db/seed/proposals/issue-<n>.json after promote
  --dry-run               Validate only; do not write seed or remove proposal
  --help                  Show this help

Examples:
  npm run proposal:promote -- 42
  npm run proposal:promote -- 42 --seed db/seed/web-pentesting-expansion.json
  npm run proposal:promote -- 42 --assign-path-order --remove-proposal

After promote, load both editorial seeds into local D1:
  npm run db:seed:local:all
`);
}

function parseArgs(argv) {
  let seedPath = DEFAULT_PROMOTE_SEED_PATH;
  let assignPathOrder = false;
  let removeProposal = false;
  let dryRun = false;
  let issueNumber = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }
    if (arg === "--seed") {
      seedPath = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--assign-path-order") {
      assignPathOrder = true;
      continue;
    }
    if (arg === "--remove-proposal") {
      removeProposal = true;
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

  if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
    throw new Error("Provide a positive GitHub issue number");
  }

  return { issueNumber, seedPath, assignPathOrder, removeProposal, dryRun };
}

async function readJson(relativePath) {
  const filePath = path.join(projectRoot, relativePath);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function loadAllResources(excludeSeedPath = null) {
  const byId = new Map();
  const byUrl = new Map();

  for (const relativePath of EDITORIAL_SEED_PATHS) {
    const seed = await readJson(relativePath);
    for (const resource of seed.resources) {
      byId.set(resource.id, { resource, seedPath: relativePath });
      byUrl.set(normalizeComparableUrl(resource.url), {
        resource,
        seedPath: relativePath,
      });
      if (resource.original_source_url) {
        byUrl.set(normalizeComparableUrl(resource.original_source_url), {
          resource,
          seedPath: relativePath,
        });
      }
    }
  }

  return { byId, byUrl, excludeSeedPath };
}

function nextPathOrder(resources) {
  return resources.reduce((max, resource) => Math.max(max, resource.path_order), 0) + 1;
}

function assertPromotable(resource, targetSeedPath, targetResources, indexMaps) {
  validateSeedResource(resource, `issue proposal`);

  const existingInTarget = targetResources.findIndex((row) => row.id === resource.id);
  const isUpdate = existingInTarget >= 0;

  if (!isUpdate) {
    const idHit = indexMaps.byId.get(resource.id);
    if (idHit && idHit.seedPath !== targetSeedPath) {
      throw new Error(`Resource id "${resource.id}" already exists in ${idHit.seedPath}`);
    }

    const urlHit = indexMaps.byUrl.get(normalizeComparableUrl(resource.url));
    if (urlHit && urlHit.resource.id !== resource.id) {
      throw new Error(
        `Resource url "${resource.url}" already exists as ${urlHit.resource.id} in ${urlHit.seedPath}`,
      );
    }
  }
}

function resolvePathOrder(resource, targetResources, assignPathOrder) {
  const others = targetResources.filter((row) => row.id !== resource.id);
  const usedOrders = new Set(others.map((row) => row.path_order));

  if (!assignPathOrder) {
    if (usedOrders.has(resource.path_order)) {
      throw new Error(
        `path_order ${resource.path_order} is already used in the target seed. Re-run with --assign-path-order.`,
      );
    }
    return resource.path_order;
  }

  if (!usedOrders.has(resource.path_order)) {
    return resource.path_order;
  }

  return nextPathOrder(others);
}

function applyPromote(resource, targetResources, assignPathOrder) {
  const pathOrder = resolvePathOrder(resource, targetResources, assignPathOrder);
  const nextResource = { ...resource, path_order: pathOrder };
  const existingIndex = targetResources.findIndex((row) => row.id === nextResource.id);

  if (existingIndex >= 0) {
    targetResources[existingIndex] = nextResource;
    return "updated";
  }

  targetResources.push(nextResource);
  targetResources.sort((a, b) => a.path_order - b.path_order);
  return "added";
}

async function main() {
  const { issueNumber, seedPath, assignPathOrder, removeProposal, dryRun } = parseArgs(
    process.argv.slice(2),
  );

  if (!EDITORIAL_SEED_PATHS.includes(seedPath)) {
    throw new Error(
      `Unsupported seed path "${seedPath}". Use one of: ${EDITORIAL_SEED_PATHS.join(", ")}`,
    );
  }

  const proposalRelative = `db/seed/proposals/issue-${issueNumber}.json`;
  const proposalPath = path.join(projectRoot, proposalRelative);

  let proposalRaw;
  try {
    proposalRaw = await fs.readFile(proposalPath, "utf8");
  } catch {
    throw new Error(`Proposal file not found: ${proposalRelative}. Run proposal:intake first.`);
  }

  const resource = JSON.parse(proposalRaw);
  const seed = await readJson(seedPath);
  const indexMaps = await loadAllResources();

  assertPromotable(resource, seedPath, seed.resources, indexMaps);

  const action = applyPromote(resource, seed.resources, assignPathOrder);
  validateSeed(seed);

  const promoted = seed.resources.find((row) => row.id === resource.id);

  if (dryRun) {
    console.log(`Dry run OK: would ${action} ${promoted.id} in ${seedPath}`);
    return;
  }

  const seedFilePath = path.join(projectRoot, seedPath);
  await fs.writeFile(seedFilePath, `${JSON.stringify(seed, null, 2)}\n`, "utf8");

  console.log(`${action === "updated" ? "Updated" : "Added"} ${promoted.id} in ${seedPath}`);
  console.log(`  title: ${promoted.title}`);
  console.log(`  path_order: ${promoted.path_order}`);
  console.log("");
  console.log("Next:");
  console.log("  npm run db:seed:local:all");
  console.log("  npm run cache:clear:local");

  if (removeProposal) {
    await fs.unlink(proposalPath);
    console.log(`Removed ${proposalRelative}`);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Proposal promote failed: ${message}`);
  process.exit(1);
});
