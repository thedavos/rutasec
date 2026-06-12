import { describe, expect, it } from "vite-plus/test";

import { buildProposalCloseComment } from "#/shared/utils/build-proposal-close-comment";

describe("buildProposalCloseComment", () => {
  it("builds a generic acceptance comment without resource id", () => {
    expect(buildProposalCloseComment()).toContain("merged into the RutaSec catalog seed");
    expect(buildProposalCloseComment()).not.toContain("`");
  });

  it("includes the resource id when provided", () => {
    expect(buildProposalCloseComment("res-video-example")).toContain("`res-video-example`");
  });
});
