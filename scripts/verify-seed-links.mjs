#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const defaultSeedPath = path.join(projectRoot, "db/seed/web-pentesting-starter.json");

const TIMEOUT_MS = 15_000;
const CONCURRENCY = 3;
const MANUAL_OK_URLS = new Set(["https://labex.io/linuxjourney"]);

function usage() {
  console.log(`Usage:
  node scripts/verify-seed-links.mjs [seed.json]

Checks HTTP reachability for url and original_source_url on each seed resource.
Exits 1 if any URL returns 4xx/5xx or fails to connect.
`);
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; RutaSec-Seed-Verify/1.0)" },
    });

    if (response.status === 405 || response.status === 501 || response.status === 404) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; RutaSec-Seed-Verify/1.0)" },
      });
    }

    return {
      ok: response.status >= 200 && response.status < 400,
      status: response.status,
      finalUrl: response.url,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      finalUrl: null,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function mapConcurrent(items, limit, fn) {
  const results = Array.from({ length: items.length });
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current], current);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

function pad(value, width) {
  return String(value).padEnd(width);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("-h") || args.includes("--help")) {
    usage();
    return;
  }

  const seedPath = args[0] ? path.resolve(process.cwd(), args[0]) : defaultSeedPath;
  const raw = await fs.readFile(seedPath, "utf8");
  const seed = JSON.parse(raw);
  const resources = seed.resources ?? [];

  const checks = [];
  for (const resource of resources) {
    for (const field of ["url", "original_source_url"]) {
      checks.push({
        id: resource.id,
        title: resource.title,
        field,
        url: resource[field],
      });
    }
  }

  const uniqueChecks = [];
  const seen = new Set();
  for (const check of checks) {
    const key = `${check.id}:${check.url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueChecks.push(check);
  }

  console.log(
    `Checking ${uniqueChecks.length} URLs from ${path.relative(projectRoot, seedPath)}...\n`,
  );

  const results = await mapConcurrent(uniqueChecks, CONCURRENCY, async (check) => {
    const result = await checkUrl(check.url);
    return { ...check, ...result };
  });

  const idWidth = Math.max(2, ...results.map((r) => r.id.length));
  const titleWidth = Math.min(40, Math.max(5, ...results.map((r) => r.title.length)));

  console.log(`${pad("ID", idWidth)}  ${pad("TITLE", titleWidth)}  FIELD  STATUS  RESULT`);
  console.log("-".repeat(idWidth + titleWidth + 40));

  let failures = 0;

  for (const row of results) {
    const statusLabel = row.status ?? "ERR";
    const manualOk = !row.ok && row.status === 403 && MANUAL_OK_URLS.has(row.url);
    const okMark = row.ok ? "ok" : manualOk ? "manual (browser verified)" : "FAIL";
    const redirectNote = row.finalUrl && row.finalUrl !== row.url ? ` → ${row.finalUrl}` : "";
    const errorNote = row.error ? ` (${row.error})` : "";

    if (!row.ok && !manualOk) failures += 1;

    console.log(
      `${pad(row.id, idWidth)}  ${pad(row.title.slice(0, titleWidth), titleWidth)}  ${pad(row.field, 5)}  ${pad(statusLabel, 6)}  ${okMark}${redirectNote}${errorNote}`,
    );
  }

  console.log(`\n${results.length - failures}/${results.length} URLs reachable.`);

  if (failures > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
