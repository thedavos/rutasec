export type SupportedLocale = "en" | "es";

const supportedLocales = new Set<SupportedLocale>(["en", "es"]);

function parseAcceptLanguage(header: string): SupportedLocale | undefined {
  const primary = header.split(",")[0]?.trim().split("-")[0]?.toLowerCase();
  if (primary === "es") {
    return "es";
  }
  if (primary === "en") {
    return "en";
  }
  return undefined;
}

export function resolveLocalePreference(input: {
  cookie?: string | null;
  acceptLanguage?: string | null;
}): SupportedLocale {
  const cookie = input.cookie?.trim();
  if (cookie && supportedLocales.has(cookie as SupportedLocale)) {
    return cookie as SupportedLocale;
  }

  if (input.acceptLanguage) {
    const fromBrowser = parseAcceptLanguage(input.acceptLanguage);
    if (fromBrowser) {
      return fromBrowser;
    }
  }

  return "en";
}
