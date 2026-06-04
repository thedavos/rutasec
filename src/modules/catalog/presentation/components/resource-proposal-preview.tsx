import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ResourceProposalPreviewProps = {
  bodyMarkdown: string;
};

const cardClassName = "island-shell rounded-2xl border border-[var(--border-default)] p-6";

export function ResourceProposalPreview({ bodyMarkdown }: ResourceProposalPreviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="display-title text-xl font-bold text-[var(--text-primary)]">GitHub issue</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          This is what reviewers will see in the GitHub issue.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className={cardClassName}>
          <h3 className="display-title text-base font-bold text-[var(--text-primary)]">Preview</h3>
          <div className="prose prose-sm mt-4 max-h-64 max-w-none overflow-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{bodyMarkdown}</ReactMarkdown>
          </div>
        </div>

        <div className={cardClassName}>
          <h3 className="display-title text-base font-bold text-[var(--text-primary)]">Markdown</h3>
          <pre className="type-mono mt-4 max-h-64 overflow-auto text-xs leading-relaxed whitespace-pre-wrap text-[var(--text-primary)]">
            {bodyMarkdown}
          </pre>
        </div>
      </div>
    </div>
  );
}
