#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const seedFiles = ["db/seed/web-pentesting-starter.json", "db/seed/web-pentesting-expansion.json"];

function resolveResourceIconUrl(url) {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    const host = parsed.hostname.replace(/^www\./i, "");
    if (!host) {
      return null;
    }

    return `https://icons.duckduckgo.com/ip3/${host}.ico`;
  } catch {
    return null;
  }
}

async function backfillSeedFile(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  const raw = await fs.readFile(absolutePath, "utf8");
  const seed = JSON.parse(raw);

  if (!Array.isArray(seed.resources)) {
    throw new Error(`${relativePath} must contain a resources array`);
  }

  let updated = 0;
  for (const resource of seed.resources) {
    if (resource.icon_url) {
      continue;
    }

    const iconUrl = resolveResourceIconUrl(resource.url);
    if (iconUrl) {
      resource.icon_url = iconUrl;
      updated += 1;
    }
  }

  await fs.writeFile(absolutePath, `${JSON.stringify(seed, null, 2)}\n`, "utf8");
  console.log(`${relativePath}: set icon_url on ${updated} resources`);
}

for (const seedFile of seedFiles) {
  await backfillSeedFile(seedFile);
}
