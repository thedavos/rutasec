import { useState } from "react";

import { authClient } from "#/modules/identity";
import { saveResourceFn } from "#/modules/library";
import { Button } from "#/shared/presentation/ui/button";

type AddToLibraryButtonProps = {
  resourceId: string;
};

type SaveUiState = "idle" | "saving" | "saved" | "error";

export function AddToLibraryButton({ resourceId }: AddToLibraryButtonProps) {
  const { data: session, isPending } = authClient.useSession();
  const [saveState, setSaveState] = useState<SaveUiState>("idle");

  if (isPending || !session?.user) {
    return null;
  }

  if (saveState === "saved") {
    return (
      <Button type="button" size="sm" variant="secondary" disabled>
        In library
      </Button>
    );
  }

  const isSaving = saveState === "saving";

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={isSaving}
      onClick={() => {
        void (async () => {
          setSaveState("saving");
          try {
            await saveResourceFn({ data: { resourceId } });
            setSaveState("saved");
          } catch {
            setSaveState("error");
          }
        })();
      }}
    >
      {isSaving ? "Adding…" : saveState === "error" ? "Try again" : "Add to library"}
    </Button>
  );
}
