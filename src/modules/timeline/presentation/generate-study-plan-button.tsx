import { useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { generateStudyPlanForGoalFn } from "#/modules/timeline";
import { Button } from "#/shared/presentation/ui/button";

type GenerateStudyPlanButtonProps = {
  goalId: string;
};

export function GenerateStudyPlanButton({ goalId }: GenerateStudyPlanButtonProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleGenerate() {
    if (isGenerating) {
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      await generateStudyPlanForGoalFn({ data: { goalId } });
      await router.invalidate();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not generate study plan.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? "Generating…" : "Generate study plan"}
      </Button>
      {errorMessage ? (
        <p className="text-sm text-[var(--destructive)]" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
