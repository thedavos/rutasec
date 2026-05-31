import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "#/modules/identity";
import { saveResourceFn } from "#/modules/library";
import { Button } from "#/shared/presentation/ui/button";
import { Skeleton } from "#/shared/presentation/ui/skeleton";

type SaveToLibraryCtaProps = {
  resourceId: string;
  signInRedirect: string;
};

type SaveUiState = "idle" | "saving" | "saved" | "error";

export function SaveToLibraryCta({ resourceId, signInRedirect }: SaveToLibraryCtaProps) {
  const { data: session, isPending } = authClient.useSession();
  const [saveState, setSaveState] = useState<SaveUiState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaveState("saving");
    setErrorMessage(null);

    try {
      await saveResourceFn({ data: { resourceId } });
      setSaveState("saved");
    } catch (error) {
      setSaveState("error");
      setErrorMessage(error instanceof Error ? error.message : "Could not save this resource.");
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
            Sign in to save
          </Link>
        </Button>
        <p className="text-xs leading-relaxed text-[var(--sea-ink-soft)]">
          Sign in to add this resource to your personal library.
        </p>
      </div>
    );
  }

  if (saveState === "saved") {
    return (
      <div className="space-y-2">
        <Button type="button" variant="secondary" className="w-full" disabled>
          Saved to library
        </Button>
        <p className="text-xs leading-relaxed text-[var(--sea-ink-soft)]">
          This resource is in your library. Your library view ships next.
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
        {isSaving ? "Saving…" : "Save to library"}
      </Button>
      {errorMessage ? (
        <p className="text-xs leading-relaxed text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : (
        <p className="text-xs leading-relaxed text-[var(--sea-ink-soft)]">
          Track this resource in your personal library.
        </p>
      )}
    </div>
  );
}
