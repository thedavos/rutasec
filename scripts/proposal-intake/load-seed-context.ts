import fs from "node:fs/promises";
import path from "node:path";

import { normalizeComparableUrl } from "#/shared/utils/normalize-comparable-url";

import type { SeedResource } from "./seed-resource-schema";

export type SeedContext = {
  existingUrls: Set<string>;
  existingIds: Set<string>;
  categories: string[];
  topics: string[];
  phases: string[];
  nextPathOrder: number;
};

type SeedFile = {
  resources: SeedResource[];
};

const SEED_FILES = [
  "db/seed/web-pentesting-starter.json",
  "db/seed/web-pentesting-expansion.json",
] as const;

export async function loadSeedContext(projectRoot: string): Promise<SeedContext> {
  const existingUrls = new Set<string>();
  const existingIds = new Set<string>();
  const categories = new Set<string>();
  const topics = new Set<string>();
  const phases = new Set<string>();
  let nextPathOrder = 0;

  for (const relativePath of SEED_FILES) {
    const filePath = path.join(projectRoot, relativePath);
    const raw = await fs.readFile(filePath, "utf8");
    const seed = JSON.parse(raw) as SeedFile;

    for (const resource of seed.resources) {
      existingUrls.add(normalizeComparableUrl(resource.url));
      existingUrls.add(normalizeComparableUrl(resource.original_source_url));
      existingIds.add(resource.id);
      categories.add(resource.category);
      topics.add(resource.topic);
      phases.add(resource.phase);
      nextPathOrder = Math.max(nextPathOrder, resource.path_order);
    }
  }

  return {
    existingUrls,
    existingIds,
    categories: [...categories].sort(),
    topics: [...topics].sort(),
    phases: [...phases].sort(),
    nextPathOrder: nextPathOrder + 1,
  };
}

export function assertUrlNotDuplicate(url: string, context: SeedContext): void {
  const normalized = normalizeComparableUrl(url);
  if (context.existingUrls.has(normalized)) {
    throw new Error(`Duplicate seed URL: ${url}`);
  }
}
