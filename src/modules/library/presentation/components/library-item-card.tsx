import { Link } from "@tanstack/react-router";

import type { PersonalLibraryItem } from "#/modules/library/domain/entities/personal-library-item";
import { Badge } from "#/shared/presentation/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/presentation/ui/card";
import { cn } from "#/shared/utils";

import { statusLabels, typeLabels } from "#/modules/library/presentation/library-labels";

type LibraryItemCardProps = {
  item: PersonalLibraryItem;
};

export function LibraryItemCard({ item }: LibraryItemCardProps) {
  return (
    <Card className={cn("feature-card island-shell h-full gap-0 rounded-2xl py-0 shadow-none")}>
      <CardHeader className="gap-3 px-5 pt-5 pb-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="island-kicker rounded-full border-[var(--chip-line)]"
          >
            {item.category}
          </Badge>
          <Badge variant="outline">{statusLabels[item.status]}</Badge>
          <Badge variant="outline">{typeLabels[item.resourceType] ?? item.resourceType}</Badge>
          <Badge variant="outline" className="capitalize">
            {item.level}
          </Badge>
        </div>
        <CardTitle className="display-title text-xl font-bold leading-tight">
          <Link
            to="/resources/$id"
            params={{ id: item.resourceId }}
            className="text-[var(--sea-ink)] no-underline hover:text-[var(--lagoon-deep)]"
          >
            {item.title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 pt-2 pb-5">
        <CardDescription className="text-sm text-[var(--sea-ink-soft)]">
          Saved {new Date(item.savedAt).toLocaleDateString()}
          {item.progressPercentage > 0 ? ` · ${item.progressPercentage}% progress` : null}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
