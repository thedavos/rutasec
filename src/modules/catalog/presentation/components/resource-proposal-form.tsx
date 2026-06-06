import type { ResourceType } from "#/modules/catalog/domain/entities/resource";
import type {
  ProposalLanguage,
  ResourceProposalConfirmations,
  ResourceProposalField,
  ResourceProposalInput,
} from "#/modules/catalog/domain/entities/resource-proposal";
import * as m from "#/paraglide/messages.js";
import { resourceTypeLabel } from "#/shared/i18n/resource-labels";
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

const RESOURCE_TYPES: ResourceType[] = [
  "course",
  "book",
  "documentation",
  "video",
  "lab",
  "tool",
  "article",
];

const PROPOSAL_ERROR_MESSAGES: Record<string, () => string> = {
  url_required: () => m.proposal_error_url_required(),
  url_invalid: () => m.proposal_error_url_invalid(),
  title_required: () => m.proposal_error_title_required(),
  category_required: () => m.proposal_error_category_required(),
  format_required: () => m.proposal_error_format_required(),
  language_required: () => m.proposal_error_language_required(),
  confirm_free: () => m.proposal_error_confirm_free(),
  confirm_language: () => m.proposal_error_confirm_language(),
};

function proposalErrorMessage(code: string): string {
  return PROPOSAL_ERROR_MESSAGES[code]?.() ?? code;
}

type ResourceProposalFormProps = {
  input: ResourceProposalInput;
  categories: string[];
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
  categories,
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
          {m.proposal_form_title()}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{m.proposal_form_subtitle()}</p>
      </div>

      <div className="island-shell rounded-2xl border border-[var(--border-default)] p-6">
        <div className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="proposal-url">{m.proposal_url_label()}</Label>
            <Input
              id="proposal-url"
              type="url"
              value={input.url}
              onChange={(event) => onFieldChange("url", event.target.value)}
              placeholder={m.proposal_url_placeholder()}
              aria-invalid={Boolean(errors.url)}
            />
            {errors.url ? (
              <p className="text-sm text-destructive" role="alert">
                {proposalErrorMessage(errors.url)}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal-title">{m.proposal_title_label()}</Label>
            <Input
              id="proposal-title"
              value={input.title}
              onChange={(event) => onFieldChange("title", event.target.value)}
              placeholder={m.proposal_title_placeholder()}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title ? (
              <p className="text-sm text-destructive" role="alert">
                {proposalErrorMessage(errors.title)}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal-author">{m.proposal_author_label()}</Label>
            <Input
              id="proposal-author"
              value={input.authorOrProject}
              onChange={(event) => onFieldChange("authorOrProject", event.target.value)}
              placeholder={m.proposal_author_placeholder()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal-category">{m.proposal_category_label()}</Label>
            <Select
              value={input.category}
              onValueChange={(value) => onFieldChange("category", value)}
            >
              <SelectTrigger
                id="proposal-category"
                className="w-full"
                aria-invalid={Boolean(errors.category)}
              >
                <SelectValue placeholder={m.proposal_category_placeholder()} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category ? (
              <p className="text-sm text-destructive" role="alert">
                {proposalErrorMessage(errors.category)}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="proposal-format">{m.proposal_format_label()}</Label>
              <Select
                value={input.format}
                onValueChange={(value) => onFieldChange("format", value as ResourceType)}
              >
                <SelectTrigger
                  id="proposal-format"
                  className="w-full"
                  aria-invalid={Boolean(errors.format)}
                >
                  <SelectValue placeholder={m.proposal_format_placeholder()} />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_TYPES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {resourceTypeLabel(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.format ? (
                <p className="text-sm text-destructive" role="alert">
                  {proposalErrorMessage(errors.format)}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposal-language">{m.proposal_language_label()}</Label>
              <Select
                value={input.language}
                onValueChange={(value) => onFieldChange("language", value as ProposalLanguage)}
              >
                <SelectTrigger
                  id="proposal-language"
                  className="w-full"
                  aria-invalid={Boolean(errors.language)}
                >
                  <SelectValue placeholder={m.proposal_language_placeholder()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{m.proposal_language_en()}</SelectItem>
                  <SelectItem value="es">{m.proposal_language_es()}</SelectItem>
                </SelectContent>
              </Select>
              {errors.language ? (
                <p className="text-sm text-destructive" role="alert">
                  {proposalErrorMessage(errors.language)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal-notes">{m.proposal_notes_label()}</Label>
            <Textarea
              id="proposal-notes"
              value={input.notes}
              onChange={(event) => onFieldChange("notes", event.target.value)}
              placeholder={m.proposal_notes_placeholder()}
              rows={4}
              maxLength={500}
            />
            <p className="text-right text-xs text-[var(--text-muted)]">
              {m.proposal_notes_counter({ count: String(input.notes.length) })}
            </p>
          </div>

          <fieldset className="space-y-3 rounded-md border border-[var(--border-default)] p-4">
            <legend className="px-1 m-0 text-sm font-medium text-[var(--text-primary)]">
              {m.proposal_eligibility_legend()}
            </legend>

            <div className="flex items-start gap-3">
              <Checkbox
                id="proposal-is-free"
                checked={input.confirmations.isFree}
                onCheckedChange={(checked) => onConfirmationChange("isFree", checked === true)}
                aria-invalid={Boolean(errors.confirmations)}
              />
              <Label htmlFor="proposal-is-free" className="font-normal leading-snug">
                {m.proposal_confirm_free()}
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
                {m.proposal_confirm_language()}
              </Label>
            </div>

            {errors.confirmations ? (
              <p className="text-sm text-destructive" role="alert">
                {proposalErrorMessage(errors.confirmations)}
              </p>
            ) : null}
          </fieldset>
        </div>

        {copyFeedback === "copied" ? (
          <p className="mt-6 text-sm text-[var(--success)]" role="status">
            {m.proposal_copied()}
          </p>
        ) : copyFeedback === "failed" ? (
          <p className="mt-6 text-sm text-destructive" role="alert">
            {m.proposal_copy_failed()}
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onCopyProposal}>
            {m.proposal_copy_button()}
          </Button>
          <Button type="button" className="flex-1" onClick={onOpenGitHubIssue}>
            {m.proposal_open_github()}
          </Button>
        </div>
      </div>
    </div>
  );
}
