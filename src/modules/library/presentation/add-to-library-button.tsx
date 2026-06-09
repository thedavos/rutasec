import { useState } from "react";

import { authClient } from "#/modules/identity";
import { saveResourceFn } from "#/modules/library";
import {
  useGuestLibrarySave,
  useIsGuestResourceSaved,
} from "#/modules/library/presentation/guest-library/use-guest-library";
import * as m from "#/paraglide/messages.js";
import { Button } from "#/shared/presentation/ui/button";

type AddToLibraryButtonProps = {
  resourceId: string;
};

type SaveUiState = "idle" | "saving" | "saved" | "error";

export function AddToLibraryButton({ resourceId }: AddToLibraryButtonProps) {
  const { data: session, isPending } = authClient.useSession();
  const guestSave = useGuestLibrarySave();
  const { isSaved: isGuestSaved } = useIsGuestResourceSaved(resourceId);
  const [saveState, setSaveState] = useState<SaveUiState>("idle");

  if (isPending) {
    return null;
  }

  const isAuthenticated = Boolean(session?.user);
  const isSaved = isAuthenticated ? saveState === "saved" : isGuestSaved;

  if (isSaved) {
    return (
      <Button type="button" size="sm" variant="secondary" disabled>
        {m.add_in_library()}
      </Button>
    );
  }

  const isSaving = isAuthenticated ? saveState === "saving" : guestSave.isPending;

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={isSaving}
      onClick={() => {
        void (async () => {
          if (isAuthenticated) {
            setSaveState("saving");
            try {
              await saveResourceFn({ data: { resourceId } });
              setSaveState("saved");
            } catch {
              setSaveState("error");
            }
            return;
          }

          try {
            await guestSave.mutateAsync(resourceId);
          } catch {
            setSaveState("error");
          }
        })();
      }}
    >
      {isSaving ? m.add_adding() : saveState === "error" ? m.add_try_again() : m.add_to_library()}
    </Button>
  );
}
