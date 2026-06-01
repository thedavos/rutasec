import { useState } from "react";

import {
  USER_RESOURCE_STATUSES,
  updateUserResourceFn,
  type SavedUserResource,
  type UserResourceStatus,
} from "#/modules/library";
import { statusLabels } from "#/modules/library/presentation/library-labels";
import { Button } from "#/shared/presentation/ui/button";
import { Input } from "#/shared/presentation/ui/input";
import { Label } from "#/shared/presentation/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/shared/presentation/ui/select";
import { Separator } from "#/shared/presentation/ui/separator";

type ResourceProgressPanelProps = {
  resourceId: string;
  initialUserResource: SavedUserResource;
};

type SaveUiState = "idle" | "saving" | "error";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ResourceProgressPanel({
  resourceId,
  initialUserResource,
}: ResourceProgressPanelProps) {
  const [userResource, setUserResource] = useState(initialUserResource);
  const [status, setStatus] = useState<UserResourceStatus>(initialUserResource.status);
  const [progressPercentage, setProgressPercentage] = useState(
    String(initialUserResource.progressPercentage),
  );
  const [saveState, setSaveState] = useState<SaveUiState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const parsedProgress = Number.parseInt(progressPercentage, 10);
  const progressValue = Number.isNaN(parsedProgress)
    ? userResource.progressPercentage
    : Math.min(100, Math.max(0, parsedProgress));

  const isDirty =
    status !== userResource.status || progressValue !== userResource.progressPercentage;
  const isSaving = saveState === "saving";

  async function handleSave() {
    setSaveState("saving");
    setErrorMessage(null);

    try {
      const updated = await updateUserResourceFn({
        data: {
          resourceId,
          status,
          progressPercentage: progressValue,
        },
      });
      setUserResource(updated);
      setStatus(updated.status);
      setProgressPercentage(String(updated.progressPercentage));
      setSaveState("idle");
    } catch (error) {
      setSaveState("error");
      setErrorMessage(error instanceof Error ? error.message : "Could not save progress.");
    }
  }

  return (
    <div className="space-y-4">
      <Separator className="bg-[var(--line)]" />

      <div className="space-y-1">
        <p className="text-sm font-semibold text-[var(--sea-ink)]">Learning progress</p>
        <p className="text-xs leading-relaxed text-[var(--sea-ink-soft)]">
          Track status and completion for this saved resource.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`resource-status-${resourceId}`}>Status</Label>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as UserResourceStatus);
            setSaveState("idle");
          }}
        >
          <SelectTrigger id={`resource-status-${resourceId}`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {USER_RESOURCE_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {statusLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`resource-progress-${resourceId}`}>Progress (%)</Label>
        <Input
          id={`resource-progress-${resourceId}`}
          type="number"
          min={0}
          max={100}
          value={progressPercentage}
          onChange={(event) => {
            setProgressPercentage(event.target.value);
            setSaveState("idle");
          }}
        />
      </div>

      {userResource.startedAt ? (
        <p className="text-xs text-[var(--sea-ink-soft)]">
          Started {formatDate(userResource.startedAt)}
        </p>
      ) : null}
      {userResource.completedAt ? (
        <p className="text-xs text-[var(--sea-ink-soft)]">
          Completed {formatDate(userResource.completedAt)}
        </p>
      ) : null}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={!isDirty || isSaving}
        onClick={() => {
          void handleSave();
        }}
      >
        {isSaving ? "Saving…" : "Save progress"}
      </Button>

      {errorMessage ? (
        <p className="text-xs leading-relaxed text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
