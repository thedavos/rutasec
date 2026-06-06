import { useState } from "react";

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

export function SiteFooter() {
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");

  async function handleShare() {
    const href = window.location.href;
    const copied = await copyTextToClipboard(href);
    setShareStatus(copied ? "success" : "error");
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

        <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
          <Button type="button" variant="outline" size="sm" onClick={handleShare}>
            {m.footer_share()}
          </Button>
          <p aria-live="polite" className="min-w-24 text-xs text-[var(--text-secondary)]">
            {shareFeedbackMessage(shareStatus)}
          </p>
          <LanguageSelector />
        </div>
      </div>
    </footer>
  );
}
