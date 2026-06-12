export type RobotsTxtInput = {
  sitemapUrl: string;
  disallowPaths?: string[];
};

const DEFAULT_DISALLOW_PATHS = ["/dashboard", "/library", "/goals", "/sign-in", "/sign-up"];

export function buildRobotsTxt(input: RobotsTxtInput): string {
  const disallowLines = (input.disallowPaths ?? DEFAULT_DISALLOW_PATHS).map(
    (path) => `Disallow: ${path}`,
  );

  return [
    "User-agent: *",
    "Allow: /",
    ...disallowLines,
    "",
    `Sitemap: ${input.sitemapUrl}`,
    "",
  ].join("\n");
}
