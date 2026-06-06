import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "#/modules/identity";
import { saveResourceFn } from "#/modules/library";
import * as m from "#/paraglide/messages.js";
import { Button } from "#/shared/presentation/ui/button";
import { Skeleton } from "#/shared/presentation/ui/skeleton";

type SaveToLibraryCtaProps = {
  resourceId: string;
  signInRedirect: string;
  initialIsSaved?: boolean;
};

type SaveUiState = "idle" | "saving" | "saved" | "error";

export function SaveToLibraryCta({
  resourceId,
  signInRedirect,
  initialIsSaved = false,
}: SaveToLibraryCtaProps) {
  const { data: session, isPending } = authClient.useSession();
  const [saveState, setSaveState] = useState<SaveUiState>(initialIsSaved ? "saved" : "idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaveState("saving");
    setErrorMessage(null);

    try {
      await saveResourceFn({ data: { resourceId } });
      setSaveState("saved");
    } catch (error) {
      setSaveState("error");
      setErrorMessage(error instanceof Error ? error.message : m.save_error_fallback());
    }
  }

  if (isPending) {
    return <Skeleton className="h-9 w-full rounded-md" />;
  }

  if (!session?.user) {
    return (
      <div className="space-y-2">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/sign-in" search={{ redirect: signInRedirect }}>
            {m.save_sign_in_cta()}
          </Link>
        </Button>
        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          {m.save_sign_in_hint()}
        </p>
      </div>
    );
  }

  if (saveState === "saved") {
    return (
      <div className="space-y-2">
        <Button type="button" variant="secondary" className="w-full" disabled>
          {m.save_saved_button()}
        </Button>
        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          {m.save_saved_hint()}
        </p>
      </div>
    );
  }

  const isSaving = saveState === "saving";

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isSaving}
        onClick={() => {
          void handleSave();
        }}
      >
        {isSaving ? m.action_saving() : m.save_button()}
      </Button>
      {errorMessage ? (
        <p className="text-xs leading-relaxed text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : (
        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          {m.save_track_hint()}
        </p>
      )}
    </div>
  );
}
