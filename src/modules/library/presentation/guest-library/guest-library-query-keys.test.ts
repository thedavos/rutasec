import { describe, expect, it } from "vite-plus/test";

import { guestLibraryQueryKeys } from "#/modules/library/presentation/guest-library/guest-library-query-keys";

describe("guestLibraryQueryKeys", () => {
  it("builds scoped guest library query keys", () => {
    expect(guestLibraryQueryKeys.all).toEqual(["guest-library"]);
    expect(guestLibraryQueryKeys.entries()).toEqual(["guest-library", "entries"]);
    expect(guestLibraryQueryKeys.isSaved("res-1")).toEqual(["guest-library", "is-saved", "res-1"]);
  });
});
