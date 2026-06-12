import { describe, expect, it } from "vite-plus/test";

import { buildSitemapXml } from "#/shared/presentation/seo/build-sitemap-xml";

describe("buildSitemapXml", () => {
  it("renders sitemap entries with escaped URLs", () => {
    const xml = buildSitemapXml([
      {
        loc: "https://rutasec.space/",
        changefreq: "daily",
        priority: "1.0",
      },
      {
        loc: "https://rutasec.space/resources/a&b",
        changefreq: "weekly",
        priority: "0.8",
      },
    ]);

    expect(xml).toContain("<loc>https://rutasec.space/</loc>");
    expect(xml).toContain("<loc>https://rutasec.space/resources/a&amp;b</loc>");
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  });

  it("omits optional changefreq and priority when not provided", () => {
    const xml = buildSitemapXml([{ loc: "https://rutasec.space/about" }]);

    expect(xml).toContain("<loc>https://rutasec.space/about</loc>");
    expect(xml).not.toContain("<changefreq>");
    expect(xml).not.toContain("<priority>");
  });
});
