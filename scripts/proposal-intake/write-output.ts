import fs from "node:fs/promises";
import path from "node:path";

import { seedResourceSchema, type SeedResource } from "./seed-resource-schema";

export type WriteOutputOptions = {
  projectRoot: string;
  issueNumber: number;
  resource: SeedResource;
  stdout: boolean;
  dryRun: boolean;
};

export async function writeProposalOutput(options: WriteOutputOptions): Promise<string> {
  seedResourceSchema.parse(options.resource);

  const json = `${JSON.stringify(options.resource, null, 2)}\n`;

  if (options.stdout) {
    process.stdout.write(json);
    return "(stdout)";
  }

  const relativePath = `db/seed/proposals/issue-${options.issueNumber}.json`;
  const outputPath = path.join(options.projectRoot, relativePath);

  if (options.dryRun) {
    return relativePath;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, json, "utf8");
  return relativePath;
}
