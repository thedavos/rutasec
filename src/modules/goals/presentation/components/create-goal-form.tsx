import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { createGoalFn } from "#/modules/goals";
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
      setErrorMessage("Title and a positive hours/week value are required.");
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
      setErrorMessage(error instanceof Error ? error.message : "Could not create this goal.");
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
      <h2 className="display-title mb-4 text-xl font-bold text-[var(--text-primary)]">New goal</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="goal-title">Title</Label>
          <Input
            id="goal-title"
            name="title"
            required
            maxLength={200}
            placeholder="e.g. Web pentesting fundamentals"
            disabled={isSubmitDisabled}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="goal-description">Description (optional)</Label>
          <Textarea
            id="goal-description"
            name="description"
            maxLength={2000}
            placeholder="What do you want to achieve?"
            disabled={isSubmitDisabled}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal-target-date">Target date (optional)</Label>
          <Input id="goal-target-date" name="targetDate" type="date" disabled={isSubmitDisabled} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal-hours">Hours per week</Label>
          <Input
            id="goal-hours"
            name="hoursPerWeek"
            type="number"
            min={0.5}
            step={0.5}
            required
            placeholder="5"
            disabled={isSubmitDisabled}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? "Creating…" : "Create goal"}
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
