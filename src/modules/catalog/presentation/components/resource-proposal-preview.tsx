import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import * as m from "#/paraglide/messages.js";

type ResourceProposalPreviewProps = {
  bodyMarkdown: string;
};

const cardClassName = "island-shell rounded-2xl border border-[var(--border-default)] p-6";

export function ResourceProposalPreview({ bodyMarkdown }: ResourceProposalPreviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="display-title text-xl font-bold text-[var(--text-primary)]">
          {m.proposal_preview_title()}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{m.proposal_preview_subtitle()}</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className={cardClassName}>
          <h3 className="display-title text-base font-bold text-[var(--text-primary)]">
            {m.proposal_preview_heading()}
          </h3>
          <div className="prose prose-sm mt-4 max-h-64 max-w-none overflow-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{bodyMarkdown}</ReactMarkdown>
          </div>
        </div>

        <div className={cardClassName}>
          <h3 className="display-title text-base font-bold text-[var(--text-primary)]">
            {m.proposal_markdown_heading()}
          </h3>
          <pre className="type-mono mt-4 max-h-64 overflow-auto text-xs leading-relaxed whitespace-pre-wrap text-[var(--text-primary)]">
            {bodyMarkdown}
          </pre>
        </div>
      </div>
    </div>
  );
}
