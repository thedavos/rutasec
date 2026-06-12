import { describe, expect, it } from "vite-plus/test";

import { escapeXml } from "#/shared/utils/escape-xml";

describe("escapeXml", () => {
  it("escapes XML special characters", () => {
    expect(escapeXml(`Tom & Jerry "quotes" <tag> 'apostrophe'`)).toBe(
      "Tom &amp; Jerry &quot;quotes&quot; &lt;tag&gt; &apos;apostrophe&apos;",
    );
  });
});
