import { useEffect, useRef, useState } from "react";

import * as m from "#/paraglide/messages.js";
import { RUTASEC_GITHUB_URL } from "#/shared/constants/rutasec-github";
import { LanguageSelector } from "#/shared/presentation/layout/language-selector";
import { Button } from "#/shared/presentation/ui/button";
import { copyTextToClipboard } from "#/shared/utils/copy-text-to-clipboard";

type ShareStatus = "idle" | "success" | "error";

function shareFeedbackMessage(status: ShareStatus) {
  if (status === "success") {
    return m.footer_link_copied();
  }
  if (status === "error") {
    return m.footer_link_copy_failed();
  }
  return "";
}

const shareFeedbackClearDelayMs = 3000;

export function SiteFooter() {
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");
  const clearShareStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearShareStatusTimeoutRef.current) {
        clearTimeout(clearShareStatusTimeoutRef.current);
      }
    };
  }, []);

  async function handleShare() {
    if (clearShareStatusTimeoutRef.current) {
      clearTimeout(clearShareStatusTimeoutRef.current);
    }

    const href = window.location.href;
    const copied = await copyTextToClipboard(href);
    setShareStatus(copied ? "success" : "error");
    clearShareStatusTimeoutRef.current = setTimeout(() => {
      setShareStatus("idle");
      clearShareStatusTimeoutRef.current = null;
    }, shareFeedbackClearDelayMs);
  }

  return (
    <footer className="site-footer py-6">
      <div className="page-wrap flex flex-col gap-4 text-sm text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl space-y-1">
          <p>
            {m.footer_open_source_intro()}{" "}
            <a
              href={RUTASEC_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--text-primary)] underline underline-offset-4 hover:text-[var(--primary-hover)]"
            >
              {m.footer_github()}
            </a>
            .
          </p>
          <p>{m.footer_sign_in_prompt()}</p>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto sm:justify-end">
          <div className="flex flex-1 items-center gap-3 sm:flex-none">
            <p
              aria-live="polite"
              className="order-2 min-w-24 text-xs text-[var(--text-secondary)] sm:order-1 sm:text-right"
            >
              {shareFeedbackMessage(shareStatus)}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="order-1 sm:order-2"
              onClick={handleShare}
            >
              {m.footer_share()}
            </Button>
          </div>
          <span aria-hidden className="hidden text-[var(--text-muted)] sm:inline">
            |
          </span>
          <LanguageSelector />
        </div>
      </div>
    </footer>
  );
}
