import { describe, expect, it } from "vite-plus/test";

import { resolveResourceIconUrl } from "#/shared/utils/resolve-resource-icon-url";

describe("resolveResourceIconUrl", () => {
  it("returns DuckDuckGo ip3 URL for a valid https resource url", () => {
    expect(resolveResourceIconUrl("https://overthewire.org/wargames/bandit/")).toBe(
      "https://icons.duckduckgo.com/ip3/overthewire.org.ico",
    );
  });

  it("strips www from hostname", () => {
    expect(resolveResourceIconUrl("https://www.example.com/path")).toBe(
      "https://icons.duckduckgo.com/ip3/example.com.ico",
    );
  });

  it("returns null for empty or invalid urls", () => {
    expect(resolveResourceIconUrl("")).toBeNull();
    expect(resolveResourceIconUrl("   ")).toBeNull();
    expect(resolveResourceIconUrl("not-a-url")).toBeNull();
    expect(resolveResourceIconUrl("ftp://example.com")).toBeNull();
  });
});
