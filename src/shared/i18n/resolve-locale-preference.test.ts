import { describe, expect, it } from "vite-plus/test";

import { resolveLocalePreference } from "#/shared/i18n/resolve-locale-preference";

describe("resolveLocalePreference", () => {
  it("prefers a persisted cookie over browser language", () => {
    expect(
      resolveLocalePreference({
        cookie: "en",
        acceptLanguage: "es-ES,es;q=0.9",
      }),
    ).toBe("en");
  });

  it("uses Spanish from Accept-Language when no cookie is set", () => {
    expect(
      resolveLocalePreference({
        acceptLanguage: "es-MX,es;q=0.9,en;q=0.8",
      }),
    ).toBe("es");
  });

  it("uses English from Accept-Language when no cookie is set", () => {
    expect(
      resolveLocalePreference({
        acceptLanguage: "en-US,en;q=0.9",
      }),
    ).toBe("en");
  });

  it("falls back to English for unsupported browser languages", () => {
    expect(
      resolveLocalePreference({
        acceptLanguage: "fr-FR,fr;q=0.9",
      }),
    ).toBe("en");
  });

  it("falls back to English when no cookie or browser hint exists", () => {
    expect(resolveLocalePreference({})).toBe("en");
  });
});
