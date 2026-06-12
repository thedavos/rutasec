import { afterEach, describe, expect, it } from "vite-plus/test";

import { buildResourceJsonLd } from "#/shared/presentation/seo/build-resource-json-ld";

describe("buildResourceJsonLd", () => {
  afterEach(() => {
    delete process.env.PUBLIC_SITE_URL;
  });

  it("builds LearningResource structured data for a catalog resource", () => {
    process.env.PUBLIC_SITE_URL = "https://rutasec.space";

    const jsonLd = buildResourceJsonLd(
      {
        path: "/resources/portswigger-academy",
        title: "PortSwigger Web Security Academy",
        description: "Free online web security training.",
        resourceUrl: "https://portswigger.net/web-security",
        iconUrl: "https://portswigger.net/favicon.ico",
        resourceType: "course",
        isFree: true,
        language: "en",
        sourceName: "PortSwigger",
        sourceUrl: "https://portswigger.net",
      },
      "https://rutasec.space",
    );

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: "PortSwigger Web Security Academy",
      url: "https://rutasec.space/resources/portswigger-academy",
      learningResourceType: "course",
      isAccessibleForFree: true,
      inLanguage: "en",
      sameAs: "https://portswigger.net/web-security",
      provider: {
        "@type": "Organization",
        name: "PortSwigger",
        url: "https://portswigger.net",
      },
    });
  });

  it("omits inLanguage and uses fallback description when optional fields are missing", () => {
    process.env.PUBLIC_SITE_URL = "https://rutasec.space";

    const jsonLd = buildResourceJsonLd(
      {
        path: "resources/example",
        title: "Example Lab",
        description: null,
        resourceUrl: "https://example.com/lab",
        iconUrl: null,
        resourceType: "lab",
        isFree: false,
        language: null,
        sourceName: "Example",
        sourceUrl: "https://example.com",
      },
      "https://rutasec.space",
    );

    expect(jsonLd).toMatchObject({
      name: "Example Lab",
      description: "Example Lab on RutaSec.",
      url: "https://rutasec.space/resources/example",
      image: "https://rutasec.space/rutasec.png",
      isAccessibleForFree: false,
      sameAs: "https://example.com/lab",
    });
    expect(jsonLd).not.toHaveProperty("inLanguage");
  });
});
