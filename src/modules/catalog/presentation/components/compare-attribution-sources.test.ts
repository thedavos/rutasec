import { describe, expect, it } from "vite-plus/test";

import {
  areAttributionSourcesEqual,
  normalizeAttributionName,
  normalizeAttributionUrl,
} from "#/modules/catalog/presentation/components/compare-attribution-sources";

describe("normalizeAttributionName", () => {
  it("trims and lowercases names", () => {
    expect(normalizeAttributionName("  Linux Journey  ")).toBe("linux journey");
  });
});

describe("normalizeAttributionUrl", () => {
  it("normalizes host casing, www prefix, and trailing slashes", () => {
    expect(normalizeAttributionUrl("HTTPS://WWW.Example.COM/path/")).toBe("example.com/path");
  });

  it("falls back to trimmed lowercase strings for invalid urls", () => {
    expect(normalizeAttributionUrl("  not-a-valid-url/  ")).toBe("not-a-valid-url");
  });
});

describe("areAttributionSourcesEqual", () => {
  it("returns true when original and curated sources match after normalization", () => {
    expect(
      areAttributionSourcesEqual(
        { name: "Linux Journey", url: "https://linuxjourney.com/" },
        { name: "  linux journey ", url: "HTTPS://LinuxJourney.com" },
      ),
    ).toBe(true);
  });

  it("returns false when names or urls differ", () => {
    expect(
      areAttributionSourcesEqual(
        { name: "Linux Journey", url: "https://linuxjourney.com/" },
        { name: "Cybersecurity-Mastery-Roadmap", url: "https://github.com/example/roadmap" },
      ),
    ).toBe(false);

    expect(
      areAttributionSourcesEqual(
        { name: "Linux Journey", url: "https://linuxjourney.com/" },
        { name: "Linux Journey", url: "https://example.com/other" },
      ),
    ).toBe(false);
  });
});
