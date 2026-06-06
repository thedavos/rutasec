import { getLocale, locales, setLocale, type Locale } from "#/paraglide/runtime.js";
import * as m from "#/paraglide/messages.js";
import { Button } from "#/shared/presentation/ui/button";
import { cn } from "#/shared/utils";

const localeLabels: Record<Locale, () => string> = {
  en: () => m.footer_language_english(),
  es: () => m.footer_language_spanish(),
};

export function LanguageSelector() {
  const activeLocale = getLocale();

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label={m.footer_language_selector_aria()}
    >
      {locales.map((locale) => {
        const isActive = locale === activeLocale;

        return (
          <Button
            key={locale}
            type="button"
            variant={isActive ? "default" : "outline"}
            size="sm"
            aria-current={isActive ? "true" : undefined}
            className={cn("min-w-10 px-2 uppercase", isActive && "pointer-events-none")}
            onClick={() => {
              if (locale !== activeLocale) {
                void setLocale(locale);
              }
            }}
          >
            {locale}
          </Button>
        );
      })}
      <span className="sr-only">{localeLabels[activeLocale]()}</span>
    </div>
  );
}
