import { useState } from "react";

import {
  USER_RESOURCE_STATUSES,
  updateUserResourceFn,
  type SavedUserResource,
  type UserResourceStatus,
} from "#/modules/library";
import * as m from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";
import { userResourceStatusLabel } from "#/shared/i18n/resource-labels";
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
  return new Date(iso).toLocaleDateString(getLocale(), {
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
      setErrorMessage(error instanceof Error ? error.message : m.progress_error_fallback());
    }
  }

  return (
    <div className="space-y-4">
      <Separator className="bg-[var(--border-default)]" />

      <div className="space-y-1">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{m.progress_title()}</p>
        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          {m.progress_description()}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`resource-status-${resourceId}`}>{m.label_status()}</Label>
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
                {userResourceStatusLabel(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`resource-progress-${resourceId}`}>{m.progress_percent_label()}</Label>
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
        <p className="text-xs text-[var(--text-secondary)]">
          {m.progress_started({ date: formatDate(userResource.startedAt) })}
        </p>
      ) : null}
      {userResource.completedAt ? (
        <p className="text-xs text-[var(--text-secondary)]">
          {m.progress_completed({ date: formatDate(userResource.completedAt) })}
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
        {isSaving ? m.action_saving() : m.progress_save_button()}
      </Button>

      {errorMessage ? (
        <p className="text-xs leading-relaxed text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
