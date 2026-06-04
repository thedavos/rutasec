import type { ResourceType } from "#/modules/catalog/domain/entities/resource";

export type ProposalLanguage = "en" | "es";

export type ResourceProposalConfirmations = {
  isFree: boolean;
  isEnglishOrSpanish: boolean;
};

export type ResourceProposalInput = {
  url: string;
  title: string;
  authorOrProject: string;
  category: string;
  format: ResourceType;
  language: ProposalLanguage;
  notes: string;
  confirmations: ResourceProposalConfirmations;
};

export type ResourceProposalIssue = {
  title: string;
  bodyMarkdown: string;
  issueUrl: string;
};

export type ResourceProposalField =
  | keyof Omit<ResourceProposalInput, "confirmations">
  | "confirmations";

export type ResourceProposalValidation =
  | { ok: true; value: ResourceProposalInput }
  | { ok: false; errors: Partial<Record<ResourceProposalField, string>> };

export const EMPTY_RESOURCE_PROPOSAL_INPUT: ResourceProposalInput = {
  url: "",
  title: "",
  authorOrProject: "",
  category: "",
  format: "article",
  language: "en",
  notes: "",
  confirmations: {
    isFree: false,
    isEnglishOrSpanish: false,
  },
};
