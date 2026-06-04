import { useMemo, useState } from "react";

import {
  buildResourceProposalIssue,
  validateResourceProposal,
} from "#/modules/catalog/domain/build-resource-proposal-issue";
import {
  EMPTY_RESOURCE_PROPOSAL_INPUT,
  type ResourceProposalConfirmations,
  type ResourceProposalInput,
} from "#/modules/catalog/domain/entities/resource-proposal";
import { ResourceProposalForm } from "#/modules/catalog/presentation/components/resource-proposal-form";
import { ResourceProposalPreview } from "#/modules/catalog/presentation/components/resource-proposal-preview";

export function SendResourcePage() {
  const [input, setInput] = useState<ResourceProposalInput>(EMPTY_RESOURCE_PROPOSAL_INPUT);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const validation = useMemo(() => validateResourceProposal(input), [input]);
  const issue = useMemo(() => buildResourceProposalIssue(input), [input]);
  const isComplete = validation.ok;
  const errors = validation.ok ? {} : validation.errors;

  function updateField<K extends keyof ResourceProposalInput>(
    key: K,
    value: ResourceProposalInput[K],
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function updateConfirmation(key: keyof ResourceProposalConfirmations, checked: boolean) {
    setInput((current) => ({
      ...current,
      confirmations: { ...current.confirmations, [key]: checked },
    }));
  }

  function handleOpenGitHubIssue() {
    if (!isComplete) {
      return;
    }

    window.open(issue.issueUrl, "_blank", "noopener,noreferrer");
  }

  async function handleCopyProposal() {
    if (!isComplete) {
      return;
    }

    await navigator.clipboard.writeText(issue.bodyMarkdown);
    setCopyFeedback(true);
    window.setTimeout(() => setCopyFeedback(false), 2000);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="max-w-3xl">
        <p className="island-kicker mb-2">Send Resource</p>
        <h1 className="display-title text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
          Proponer recursos gratuitos sin tocar el catálogo
        </h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          Prepare a GitHub issue with the minimum fields we review: link, title, category, format,
          language, and confirmation that the resource is free and available in English or Spanish.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <ResourceProposalForm
          input={input}
          errors={errors}
          isComplete={isComplete}
          copyFeedback={copyFeedback}
          onFieldChange={updateField}
          onConfirmationChange={updateConfirmation}
          onOpenGitHubIssue={handleOpenGitHubIssue}
          onCopyProposal={() => {
            void handleCopyProposal();
          }}
        />
        <ResourceProposalPreview bodyMarkdown={issue.bodyMarkdown} />
      </div>
    </div>
  );
}
