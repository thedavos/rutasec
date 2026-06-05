import { useState } from "react";

import { RUTASEC_GITHUB_URL } from "#/shared/constants/rutasec-github";
import { Button } from "#/shared/presentation/ui/button";
import { copyTextToClipboard } from "#/shared/utils/copy-text-to-clipboard";

type ShareStatus = "idle" | "success" | "error";

const shareFeedback: Record<ShareStatus, string> = {
  idle: "",
  success: "Link copied.",
  error: "Could not copy link.",
};

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
            RutaSec is an open, repository-backed cybersecurity learning catalog maintained on{" "}
            <a
              href={RUTASEC_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--text-primary)] underline underline-offset-4 hover:text-[var(--primary-hover)]"
            >
              GitHub
            </a>
            .
          </p>
          <p>Sign in to save resources to your personal library.</p>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:justify-end">
          <Button type="button" variant="outline" size="sm" onClick={handleShare}>
            Share
          </Button>
          <p aria-live="polite" className="min-w-24 text-xs text-[var(--text-secondary)]">
            {shareFeedback[shareStatus]}
          </p>
        </div>
      </div>
    </footer>
  );
}
