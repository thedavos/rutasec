// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import type { ResourceProposalInput } from "#/modules/catalog/domain/entities/resource-proposal";
import { ResourceProposalForm } from "#/modules/catalog/presentation/components/resource-proposal-form";
import * as m from "#/paraglide/messages.js";

const categories = ["API Security", "Web Application Security"];

const input: ResourceProposalInput = {
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

function renderForm(overrides: Partial<React.ComponentProps<typeof ResourceProposalForm>> = {}) {
  const props: React.ComponentProps<typeof ResourceProposalForm> = {
    input,
    categories,
    errors: {},
    copyFeedback: "idle",
    onFieldChange: vi.fn(),
    onConfirmationChange: vi.fn(),
    onOpenGitHubIssue: vi.fn(),
    onCopyProposal: vi.fn(),
    ...overrides,
  };

  render(<ResourceProposalForm {...props} />);

  return props;
}

beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
});

describe("ResourceProposalForm", () => {
  it("renders category options and applies a selected category", async () => {
    const props = renderForm();

    fireEvent.click(screen.getByRole("combobox", { name: "Category" }));

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Web Application Security" })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("option", { name: "Web Application Security" }));

    expect(props.onFieldChange).toHaveBeenCalledWith("category", "Web Application Security");
  });

  it("shows category validation errors", () => {
    renderForm({ errors: { category: "category_required" } });

    expect(screen.getByRole("alert").textContent).toBe(m.proposal_error_category_required());
  });
});
