import { describe, expect, it } from "vite-plus/test";

import { areNamedSourcesEqual } from "#/shared/utils/are-named-sources-equal";

describe("areNamedSourcesEqual", () => {
  it("returns true when sources match after normalization", () => {
    expect(
      areNamedSourcesEqual(
        { name: "Linux Journey", url: "https://linuxjourney.com/" },
        { name: "  linux journey ", url: "HTTPS://LinuxJourney.com" },
      ),
    ).toBe(true);
  });

  it("returns false when names or urls differ", () => {
    expect(
      areNamedSourcesEqual(
        { name: "Linux Journey", url: "https://linuxjourney.com/" },
        { name: "Cybersecurity-Mastery-Roadmap", url: "https://github.com/example/roadmap" },
      ),
    ).toBe(false);

    expect(
      areNamedSourcesEqual(
        { name: "Linux Journey", url: "https://linuxjourney.com/" },
        { name: "Linux Journey", url: "https://example.com/other" },
      ),
    ).toBe(false);
  });
});
