import { useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { linkResourceToGoalFn } from "#/modules/goals";
import type { PersonalLibraryItem } from "#/modules/library/domain/entities/personal-library-item";
import { Label } from "#/shared/presentation/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/shared/presentation/ui/select";

type AddGoalResourceSelectProps = {
  goalId: string;
  libraryItems: PersonalLibraryItem[];
  linkedResourceIds: Set<string>;
};

export function AddGoalResourceSelect({
  goalId,
  libraryItems,
  linkedResourceIds,
}: AddGoalResourceSelectProps) {
  const router = useRouter();
  const [isLinking, setIsLinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableItems = libraryItems.filter((item) => !linkedResourceIds.has(item.resourceId));

  async function handleValueChange(resourceId: string) {
    if (!resourceId || isLinking) {
      return;
    }

    setIsLinking(true);
    setErrorMessage(null);

    try {
      await linkResourceToGoalFn({
        data: {
          goalId,
          resourceId,
        },
      });
      await router.invalidate();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not link this resource.");
    } finally {
      setIsLinking(false);
    }
  }

  if (libraryItems.length === 0) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        Save resources from the catalog to your library before linking them to a goal.
      </p>
    );
  }

  if (availableItems.length === 0) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        All saved library resources are already linked to this goal.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`add-resource-${goalId}`} className="text-sm text-[var(--text-secondary)]">
        Add from library
      </Label>
      <Select onValueChange={handleValueChange} disabled={isLinking}>
        <SelectTrigger
          id={`add-resource-${goalId}`}
          className="w-full border-[var(--border-default)] bg-transparent"
          size="sm"
        >
          <SelectValue placeholder={isLinking ? "Linking…" : "Choose a saved resource"} />
        </SelectTrigger>
        <SelectContent>
          {availableItems.map((item) => (
            <SelectItem key={item.resourceId} value={item.resourceId}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
