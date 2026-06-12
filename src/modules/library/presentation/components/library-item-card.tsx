import { Link } from "@tanstack/react-router";

import type { ResourceType } from "#/modules/catalog/domain/entities/resource";
import { ResourceSiteIcon } from "#/modules/catalog/presentation/components/resource-site-icon";
import type { PersonalLibraryItem } from "#/modules/library/domain/entities/personal-library-item";
import * as m from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";
import {
  levelLabel,
  resourceTypeLabel,
  userResourceStatusLabel,
} from "#/shared/i18n/resource-labels";
import { Badge } from "#/shared/presentation/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/presentation/ui/card";
import { cn } from "#/shared/utils";

type LibraryItemCardProps = {
  item: PersonalLibraryItem;
};

export function LibraryItemCard({ item }: LibraryItemCardProps) {
  const savedDate = new Date(item.savedAt).toLocaleDateString(getLocale());

  return (
    <Card className={cn("feature-card island-shell h-full gap-0 rounded-2xl py-0 shadow-none")}>
      <CardHeader className="gap-3 px-5 pt-5 pb-0">
        <ResourceSiteIcon
          iconUrl={item.iconUrl}
          resourceType={item.resourceType as ResourceType}
          size="md"
        />
        <CardTitle className="display-title text-xl font-bold leading-tight">
          <Link
            to="/resources/$id"
            params={{ id: item.resourceId }}
            className="text-[var(--text-primary)] no-underline hover:text-[var(--primary-hover)]"
          >
            {item.title}
          </Link>
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="island-kicker rounded-full border-[var(--primary-border)]"
          >
            {item.category}
          </Badge>
          <Badge variant="outline">{userResourceStatusLabel(item.status)}</Badge>
          <Badge variant="outline">{resourceTypeLabel(item.resourceType)}</Badge>
          <Badge variant="outline">{levelLabel(item.level)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="px-5 pt-2 pb-5">
        <CardDescription className="text-sm text-[var(--text-secondary)]">
          {m.library_item_saved({ date: savedDate })}
          {item.progressPercentage > 0
            ? m.library_item_progress({ percent: String(item.progressPercentage) })
            : null}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
