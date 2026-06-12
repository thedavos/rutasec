import { afterEach, describe, expect, it } from "vite-plus/test";

import { getPublicSiteOrigin, resolvePublicAssetUrl } from "#/shared/utils/get-public-site-origin";

describe("getPublicSiteOrigin", () => {
  afterEach(() => {
    delete process.env.PUBLIC_SITE_URL;
    delete process.env.BETTER_AUTH_URL;
  });

  it("prefers PUBLIC_SITE_URL over BETTER_AUTH_URL", () => {
    process.env.PUBLIC_SITE_URL = "https://rutasec.dev/";
    process.env.BETTER_AUTH_URL = "https://auth.example.com";

    expect(getPublicSiteOrigin()).toBe("https://rutasec.dev");
  });

  it("falls back to BETTER_AUTH_URL when PUBLIC_SITE_URL is missing", () => {
    process.env.BETTER_AUTH_URL = "https://auth.example.com/";

    expect(getPublicSiteOrigin()).toBe("https://auth.example.com");
  });

  it("falls back to localhost when no env is configured", () => {
    expect(getPublicSiteOrigin()).toBe("http://localhost:3000");
  });
});

describe("resolvePublicAssetUrl", () => {
  afterEach(() => {
    delete process.env.PUBLIC_SITE_URL;
    delete process.env.BETTER_AUTH_URL;
  });

  it("keeps absolute URLs unchanged", () => {
    expect(resolvePublicAssetUrl("https://example.com/icon.png")).toBe(
      "https://example.com/icon.png",
    );
  });

  it("prefixes relative paths with PUBLIC_SITE_URL", () => {
    process.env.PUBLIC_SITE_URL = "https://rutasec.dev";

    expect(resolvePublicAssetUrl("/rutasec.png")).toBe("https://rutasec.dev/rutasec.png");
  });

  it("falls back to the default social image for empty values", () => {
    expect(resolvePublicAssetUrl("")).toBe("http://localhost:3000/rutasec.png");
  });
});
