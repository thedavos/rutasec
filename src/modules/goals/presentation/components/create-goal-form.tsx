import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { createGoalFn } from "#/modules/goals";
import * as m from "#/paraglide/messages.js";
import { Button } from "#/shared/presentation/ui/button";
import { Input } from "#/shared/presentation/ui/input";
import { Label } from "#/shared/presentation/ui/label";
import { Textarea } from "#/shared/presentation/ui/textarea";

type FormState = "idle" | "submitting" | "error";

function getFormString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function CreateGoalForm() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = getFormString(formData, "title").trim();
    const description = getFormString(formData, "description").trim();
    const targetDate = getFormString(formData, "targetDate").trim();
    const hoursPerWeekRaw = getFormString(formData, "hoursPerWeek").trim();
    const hoursPerWeek = Number(hoursPerWeekRaw);

    if (!title || !Number.isFinite(hoursPerWeek) || hoursPerWeek <= 0) {
      setFormState("error");
      setErrorMessage(m.goal_validation_error());
      return;
    }

    try {
      await createGoalFn({
        data: {
          title,
          description: description || undefined,
          targetDate: targetDate || undefined,
          hoursPerWeek,
        },
      });
      form.reset();
      await router.invalidate();
      setFormState("idle");
    } catch (error) {
      setFormState("error");
      setErrorMessage(error instanceof Error ? error.message : m.goal_create_error_fallback());
    }
  }

  const isSubmitting = formState === "submitting";
  const isSubmitDisabled = !isHydrated || isSubmitting;

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="island-shell rounded-2xl border-[var(--border-default)] p-6"
    >
      <h2 className="display-title mb-4 text-xl font-bold text-[var(--text-primary)]">
        {m.goal_form_title()}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="goal-title">{m.goal_title_label()}</Label>
          <Input
            id="goal-title"
            name="title"
            required
            maxLength={200}
            placeholder={m.goal_title_placeholder()}
            disabled={isSubmitDisabled}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="goal-description">{m.goal_description_label()}</Label>
          <Textarea
            id="goal-description"
            name="description"
            maxLength={2000}
            placeholder={m.goal_description_placeholder()}
            disabled={isSubmitDisabled}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal-target-date">{m.goal_target_date_label()}</Label>
          <Input id="goal-target-date" name="targetDate" type="date" disabled={isSubmitDisabled} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal-hours">{m.goal_hours_label()}</Label>
          <Input
            id="goal-hours"
            name="hoursPerWeek"
            type="number"
            min={0.5}
            step={0.5}
            required
            placeholder={m.goal_hours_placeholder()}
            disabled={isSubmitDisabled}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? m.goal_creating() : m.goal_create_button()}
        </Button>
        {errorMessage ? (
          <p className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
