import { describe, expect, it } from "vite-plus/test";

import { buildRobotsTxt } from "#/shared/presentation/seo/build-robots-txt";

describe("buildRobotsTxt", () => {
  it("includes allow rules, disallowed private paths, and sitemap URL", () => {
    const robots = buildRobotsTxt({
      sitemapUrl: "https://rutasec.space/sitemap.xml",
    });

    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Disallow: /dashboard");
    expect(robots).toContain("Disallow: /sign-in");
    expect(robots).toContain("Sitemap: https://rutasec.space/sitemap.xml");
  });

  it("supports custom disallow paths", () => {
    const robots = buildRobotsTxt({
      sitemapUrl: "https://rutasec.space/sitemap.xml",
      disallowPaths: ["/private"],
    });

    expect(robots).toContain("Disallow: /private");
    expect(robots).not.toContain("Disallow: /dashboard");
  });
});
