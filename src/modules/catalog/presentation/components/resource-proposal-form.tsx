import type { ResourceType } from "#/modules/catalog/domain/entities/resource";
import type {
  ProposalLanguage,
  ResourceProposalConfirmations,
  ResourceProposalField,
  ResourceProposalInput,
} from "#/modules/catalog/domain/entities/resource-proposal";
import { Button } from "#/shared/presentation/ui/button";
import { Checkbox } from "#/shared/presentation/ui/checkbox";
import { Input } from "#/shared/presentation/ui/input";
import { Label } from "#/shared/presentation/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/shared/presentation/ui/select";
import { Textarea } from "#/shared/presentation/ui/textarea";

const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  course: "Course",
  book: "Book",
  documentation: "Documentation",
  video: "Video",
  lab: "Lab",
  tool: "Tool",
  article: "Article",
};

type ResourceProposalFormProps = {
  input: ResourceProposalInput;
  errors: Partial<Record<ResourceProposalField, string>>;
  copyFeedback: "idle" | "copied" | "failed";
  onFieldChange: <K extends keyof ResourceProposalInput>(
    key: K,
    value: ResourceProposalInput[K],
  ) => void;
  onConfirmationChange: (key: keyof ResourceProposalConfirmations, checked: boolean) => void;
  onOpenGitHubIssue: () => void;
  onCopyProposal: () => void;
};

export function ResourceProposalForm({
  input,
  errors,
  copyFeedback,
  onFieldChange,
  onConfirmationChange,
  onOpenGitHubIssue,
  onCopyProposal,
}: ResourceProposalFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="display-title text-xl font-bold text-[var(--text-primary)]">
          Resource details
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Fill in the fields below to prepare your proposal.
        </p>
      </div>

      <div className="island-shell rounded-2xl border border-[var(--border-default)] p-6">
        <div className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="proposal-url">Resource URL</Label>
            <Input
              id="proposal-url"
              type="url"
              value={input.url}
              onChange={(event) => onFieldChange("url", event.target.value)}
              placeholder="https://example.com/resource"
              aria-invalid={Boolean(errors.url)}
            />
            {errors.url ? (
              <p className="text-sm text-destructive" role="alert">
                {errors.url}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal-title">Title</Label>
            <Input
              id="proposal-title"
              value={input.title}
              onChange={(event) => onFieldChange("title", event.target.value)}
              placeholder="Resource title"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title ? (
              <p className="text-sm text-destructive" role="alert">
                {errors.title}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal-author">Author or project (optional)</Label>
            <Input
              id="proposal-author"
              value={input.authorOrProject}
              onChange={(event) => onFieldChange("authorOrProject", event.target.value)}
              placeholder="Author name or project name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal-category">Category</Label>
            <Input
              id="proposal-category"
              value={input.category}
              onChange={(event) => onFieldChange("category", event.target.value)}
              placeholder="e.g. Web Application Security"
              aria-invalid={Boolean(errors.category)}
            />
            {errors.category ? (
              <p className="text-sm text-destructive" role="alert">
                {errors.category}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="proposal-format">Format</Label>
              <Select
                value={input.format}
                onValueChange={(value) => onFieldChange("format", value as ResourceType)}
              >
                <SelectTrigger
                  id="proposal-format"
                  className="w-full"
                  aria-invalid={Boolean(errors.format)}
                >
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RESOURCE_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.format ? (
                <p className="text-sm text-destructive" role="alert">
                  {errors.format}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposal-language">Language</Label>
              <Select
                value={input.language}
                onValueChange={(value) => onFieldChange("language", value as ProposalLanguage)}
              >
                <SelectTrigger
                  id="proposal-language"
                  className="w-full"
                  aria-invalid={Boolean(errors.language)}
                >
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
              {errors.language ? (
                <p className="text-sm text-destructive" role="alert">
                  {errors.language}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal-notes">Notes (optional)</Label>
            <Textarea
              id="proposal-notes"
              value={input.notes}
              onChange={(event) => onFieldChange("notes", event.target.value)}
              placeholder="Why should this resource be in the catalog?"
              rows={4}
              maxLength={500}
            />
            <p className="text-right text-xs text-[var(--text-muted)]">{input.notes.length}/500</p>
          </div>

          <fieldset className="space-y-3 rounded-md border border-[var(--border-default)] p-4">
            <legend className="px-1 m-0 text-sm font-medium text-[var(--text-primary)]">
              Eligibility confirmations
            </legend>

            <div className="flex items-start gap-3">
              <Checkbox
                id="proposal-is-free"
                checked={input.confirmations.isFree}
                onCheckedChange={(checked) => onConfirmationChange("isFree", checked === true)}
                aria-invalid={Boolean(errors.confirmations)}
              />
              <Label htmlFor="proposal-is-free" className="font-normal leading-snug">
                This resource is free to access.
              </Label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="proposal-language-eligible"
                checked={input.confirmations.isEnglishOrSpanish}
                onCheckedChange={(checked) =>
                  onConfirmationChange("isEnglishOrSpanish", checked === true)
                }
                aria-invalid={Boolean(errors.confirmations)}
              />
              <Label htmlFor="proposal-language-eligible" className="font-normal leading-snug">
                The resource is available in English or Spanish.
              </Label>
            </div>

            {errors.confirmations ? (
              <p className="text-sm text-destructive" role="alert">
                {errors.confirmations}
              </p>
            ) : null}
          </fieldset>
        </div>

        {copyFeedback === "copied" ? (
          <p className="mt-6 text-sm text-[var(--success)]" role="status">
            Proposal copied to clipboard
          </p>
        ) : copyFeedback === "failed" ? (
          <p className="mt-6 text-sm text-destructive" role="alert">
            Could not copy automatically. Select the preview text and copy it manually.
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onCopyProposal}>
            Copy proposal
          </Button>
          <Button type="button" className="flex-1" onClick={onOpenGitHubIssue}>
            Open GitHub issue
          </Button>
        </div>
      </div>
    </div>
  );
}
