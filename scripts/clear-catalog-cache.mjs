#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import process from "node:process";

// Keep in sync with CATALOG_CACHE_KEY_PREFIX in src/modules/catalog/adapters/cache/build-catalog-cache-key.ts
const CATALOG_CACHE_KEY_PREFIX = "catalog:";

function usage() {
  console.log(`Usage:
  node scripts/clear-catalog-cache.mjs --local
  node scripts/clear-catalog-cache.mjs --remote

Clears all KV entries for the public catalog cache (prefix "${CATALOG_CACHE_KEY_PREFIX}").`);
  process.exit(1);
}

function runWrangler(args) {
  const result = spawnSync("npx", ["wrangler", "kv", "key", ...args], {
    encoding: "utf8",
    stdio: ["inherit", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || "wrangler command failed\n");
    process.exit(result.status ?? 1);
  }

  return result.stdout.trim();
}

const args = process.argv.slice(2);
const isLocal = args.includes("--local");
const isRemote = args.includes("--remote");

if (isLocal === isRemote) {
  usage();
}

const locationFlag = isLocal ? "--local" : "--remote";
const listOutput = runWrangler([
  "list",
  "--binding",
  "CATALOG_CACHE",
  locationFlag,
  "--prefix",
  CATALOG_CACHE_KEY_PREFIX,
]);

let keys = [];
if (listOutput) {
  try {
    const parsed = JSON.parse(listOutput);
    keys = parsed.map((entry) => entry.name).filter(Boolean);
  } catch {
    keys = listOutput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith(CATALOG_CACHE_KEY_PREFIX));
  }
}

if (keys.length === 0) {
  console.log(`No catalog cache keys found (${locationFlag}).`);
  process.exit(0);
}

for (const key of keys) {
  runWrangler(["delete", key, "--binding", "CATALOG_CACHE", locationFlag]);
  console.log(`Deleted ${key}`);
}

console.log(`Cleared ${keys.length} catalog cache key(s) (${locationFlag}).`);
