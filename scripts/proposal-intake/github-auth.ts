import { execSync } from "node:child_process";

export function resolveGitHubToken(): string {
  if (process.env.GITHUB_TOKEN?.trim()) {
    return process.env.GITHUB_TOKEN.trim();
  }

  try {
    return execSync("gh auth token", { encoding: "utf8" }).trim();
  } catch {
    throw new Error("Set GITHUB_TOKEN or authenticate gh before running this command");
  }
}
