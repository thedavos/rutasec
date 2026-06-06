import { useNavigate } from "@tanstack/react-router";

import {
  USER_RESOURCE_STATUSES,
  type UserResourceStatus,
} from "#/modules/library/domain/entities/user-resource";
import * as m from "#/paraglide/messages.js";
import { formatLibrarySavedCount, userResourceStatusLabel } from "#/shared/i18n/resource-labels";
import { Button } from "#/shared/presentation/ui/button";
import { Card, CardContent, CardHeader } from "#/shared/presentation/ui/card";
import { Label } from "#/shared/presentation/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/shared/presentation/ui/select";

const ALL_STATUS_VALUE = "__all__";

type LibraryStatusFiltersProps = {
  statusFilter: UserResourceStatus | null;
  total: number;
};

export function LibraryStatusFilters({ statusFilter, total }: LibraryStatusFiltersProps) {
  const navigate = useNavigate();
  const hasFilter = statusFilter !== null;

  function applyStatus(status: UserResourceStatus | undefined) {
    void navigate({
      to: "/library",
      search: status ? { status } : {},
    });
  }

  return (
    <Card
      className="island-shell rise-in rounded-2xl border-[var(--border-default)] py-0 shadow-none"
      aria-label={m.library_filters_aria()}
    >
      <CardHeader className="gap-4 px-5 pt-5 pb-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="island-kicker mb-1">{m.library_filter_by_status()}</p>
            <p className="text-sm text-[var(--text-secondary)]">{formatLibrarySavedCount(total)}</p>
          </div>
          {hasFilter ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyStatus(undefined)}
            >
              {m.library_show_all()}
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="px-5 pt-4 pb-5 sm:max-w-xs">
        <div className="grid gap-2">
          <Label htmlFor="library-status-filter">{m.label_status()}</Label>
          <Select
            value={statusFilter ?? ALL_STATUS_VALUE}
            onValueChange={(value) => {
              if (value === ALL_STATUS_VALUE) {
                applyStatus(undefined);
                return;
              }
              if (USER_RESOURCE_STATUSES.includes(value as UserResourceStatus)) {
                applyStatus(value as UserResourceStatus);
              }
            }}
          >
            <SelectTrigger id="library-status-filter" className="w-full">
              <SelectValue placeholder={m.library_all_statuses()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUS_VALUE}>{m.library_all_statuses()}</SelectItem>
              {USER_RESOURCE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {userResourceStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
