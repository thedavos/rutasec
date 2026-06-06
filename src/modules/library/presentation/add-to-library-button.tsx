import { useState } from "react";

import { authClient } from "#/modules/identity";
import { saveResourceFn } from "#/modules/library";
import * as m from "#/paraglide/messages.js";
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
        {m.add_in_library()}
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
      {isSaving ? m.add_adding() : saveState === "error" ? m.add_try_again() : m.add_to_library()}
    </Button>
  );
}
