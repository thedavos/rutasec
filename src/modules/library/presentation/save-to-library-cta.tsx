import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "#/modules/identity";
import { saveResourceFn } from "#/modules/library";
import {
  useGuestLibrarySave,
  useIsGuestResourceSaved,
} from "#/modules/library/presentation/guest-library/use-guest-library";
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
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const guestSave = useGuestLibrarySave();
  const { isSaved: isGuestSaved, isPending: isGuestPending } = useIsGuestResourceSaved(resourceId);
  const [saveState, setSaveState] = useState<SaveUiState>(initialIsSaved ? "saved" : "idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAuthenticated = Boolean(session?.user);
  const isSaved = isAuthenticated ? saveState === "saved" || initialIsSaved : isGuestSaved;

  async function handleAuthenticatedSave() {
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

  async function handleGuestSave() {
    setErrorMessage(null);

    try {
      await guestSave.mutateAsync(resourceId);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : m.save_error_fallback());
    }
  }

  if (isSessionPending || (!isAuthenticated && isGuestPending)) {
    return <Skeleton className="h-9 w-full rounded-md" />;
  }

  if (isSaved) {
    return (
      <div className="space-y-2">
        <Button type="button" variant="secondary" className="w-full" disabled>
          {m.save_saved_button()}
        </Button>
        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          {isAuthenticated ? m.save_saved_hint() : m.guest_library_saved_hint()}
        </p>
      </div>
    );
  }

  const isSaving = isAuthenticated ? saveState === "saving" : guestSave.isPending;

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isSaving}
        onClick={() => {
          void (isAuthenticated ? handleAuthenticatedSave() : handleGuestSave());
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
          {isAuthenticated ? m.save_track_hint() : m.guest_library_save_hint()}
        </p>
      )}
      {!isAuthenticated ? (
        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          <Link
            to="/sign-in"
            search={{ redirect: signInRedirect }}
            className="text-[var(--primary-color)]"
          >
            {m.guest_library_sign_in_link()}
          </Link>{" "}
          {m.guest_library_sign_in_suffix()}
        </p>
      ) : null}
    </div>
  );
}
