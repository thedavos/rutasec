type ResourceProposalPreviewProps = {
  bodyMarkdown: string;
};

export function ResourceProposalPreview({ bodyMarkdown }: ResourceProposalPreviewProps) {
  return (
    <div className="island-shell flex h-full min-h-80 flex-col rounded-2xl border border-[var(--border-default)] p-6">
      <h2 className="display-title mb-2 text-xl font-bold text-[var(--text-primary)]">
        Issue preview
      </h2>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        This Markdown is what reviewers will see in the GitHub issue.
      </p>
      <pre className="type-mono max-h-[32rem] flex-1 overflow-auto rounded-md border border-[var(--border-default)] bg-[var(--background-muted)] p-4 text-xs leading-relaxed whitespace-pre-wrap text-[var(--text-primary)]">
        {bodyMarkdown}
      </pre>
    </div>
  );
}
