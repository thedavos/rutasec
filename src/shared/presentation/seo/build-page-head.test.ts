import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { buildPageHead } from "#/shared/presentation/seo/build-page-head";

vi.mock("#/paraglide/runtime.js", () => ({
  getLocale: () => "en",
}));

describe("buildPageHead", () => {
  afterEach(() => {
    delete process.env.PUBLIC_SITE_URL;
    delete process.env.BETTER_AUTH_URL;
  });

  it("builds description, Open Graph, and Twitter tags", () => {
    process.env.PUBLIC_SITE_URL = "https://rutasec.dev";

    const head = buildPageHead({
      title: "RutaSec — Cybersecurity Learning Catalog",
      description: "Curated courses, labs, and guides for web pentesting.",
      path: "/",
    });

    expect(head.meta).toEqual(
      expect.arrayContaining([
        { title: "RutaSec — Cybersecurity Learning Catalog" },
        {
          name: "description",
          content: "Curated courses, labs, and guides for web pentesting.",
        },
        {
          property: "og:title",
          content: "RutaSec — Cybersecurity Learning Catalog",
        },
        {
          property: "og:description",
          content: "Curated courses, labs, and guides for web pentesting.",
        },
        { property: "og:url", content: "https://rutasec.dev/" },
        { property: "og:image", content: "https://rutasec.dev/rutasec.png" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "en" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "RutaSec — Cybersecurity Learning Catalog",
        },
        {
          name: "twitter:description",
          content: "Curated courses, labs, and guides for web pentesting.",
        },
        { name: "twitter:image", content: "https://rutasec.dev/rutasec.png" },
        { name: "twitter:url", content: "https://rutasec.dev/" },
      ]),
    );
    expect(head.links).toEqual([{ rel: "canonical", href: "https://rutasec.dev/" }]);
  });

  it("normalizes paths without a leading slash", () => {
    process.env.PUBLIC_SITE_URL = "https://rutasec.dev";

    const head = buildPageHead({
      title: "Send Resource — RutaSec",
      description: "Propose a resource.",
      path: "send-resource",
    });

    expect(head.links).toEqual([{ rel: "canonical", href: "https://rutasec.dev/send-resource" }]);
  });

  it("supports article pages with custom images and JSON-LD", () => {
    process.env.PUBLIC_SITE_URL = "https://rutasec.dev";

    const head = buildPageHead({
      title: "PortSwigger Academy — RutaSec",
      description: "Hands-on web security labs.",
      path: "/resources/portswigger",
      image: "https://portswigger.net/favicon.ico",
      type: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: "PortSwigger Academy — RutaSec",
      },
    });

    expect(head.meta).toEqual(
      expect.arrayContaining([
        { property: "og:type", content: "article" },
        { property: "og:image", content: "https://portswigger.net/favicon.ico" },
        { property: "og:url", content: "https://rutasec.dev/resources/portswigger" },
      ]),
    );
    expect(head.links).toEqual([
      { rel: "canonical", href: "https://rutasec.dev/resources/portswigger" },
    ]);
    expect(head.scripts).toEqual([
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: "PortSwigger Academy — RutaSec",
        }),
      },
    ]);
  });
});
