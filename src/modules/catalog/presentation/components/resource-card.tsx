import { Link } from "@tanstack/react-router";

import type { CatalogResourceCard } from "#/modules/catalog/domain/entities/resource";
import { ResourceSiteIcon } from "#/modules/catalog/presentation/components/resource-site-icon";
import { AddToLibraryButton } from "#/modules/library/presentation/add-to-library-button";
import * as m from "#/paraglide/messages.js";
import { levelLabel, resourceTypeLabel } from "#/shared/i18n/resource-labels";
import { Badge } from "#/shared/presentation/ui/badge";
import { Button } from "#/shared/presentation/ui/button";
import { Card } from "#/shared/presentation/ui/card";
import { cn } from "#/shared/utils";

type ResourceCardProps = {
  resource: CatalogResourceCard;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className={cn("feature-card island-shell h-full gap-0 rounded-xl py-0 shadow-none")}>
      <article className="flex h-full flex-col gap-4 px-5 py-4">
        <div className="min-w-0 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{levelLabel(resource.level)}</Badge>
            <Badge variant="outline">{resourceTypeLabel(resource.resourceType)}</Badge>
            {resource.isFree ? (
              <Badge className="border-[var(--primary-border)] bg-[var(--primary-soft)] font-mono text-[var(--success)]">
                {m.badge_free()}
              </Badge>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <ResourceSiteIcon iconUrl={resource.iconUrl} resourceType={resource.resourceType} />
            <h4 className="display-title min-w-0 flex-1 text-lg font-bold leading-tight">
              <Link
                to="/resources/$id"
                params={{ id: resource.id }}
                className="text-[var(--text-primary)] no-underline hover:text-[var(--primary-hover)]"
              >
                {resource.title}
              </Link>
            </h4>
          </div>

          {resource.description ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {resource.description}
            </p>
          ) : null}

          <dl className="type-mono flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
            <div className="flex gap-2">
              <dt className="font-semibold text-[var(--text-primary)]">{m.card_topic()}</dt>
              <dd>{resource.topic}</dd>
            </div>
            {resource.subtopic ? (
              <div className="flex gap-2">
                <dt className="font-semibold text-[var(--text-primary)]">{m.card_subtopic()}</dt>
                <dd>{resource.subtopic}</dd>
              </div>
            ) : null}
            <div className="flex gap-2">
              <dt className="font-semibold text-[var(--text-primary)]">{m.card_hours()}</dt>
              <dd>{resource.estimatedHours}h</dd>
            </div>
          </dl>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="text-white">
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              {m.visit_resource()}
            </a>
          </Button>
          <AddToLibraryButton resourceId={resource.id} />
        </div>
      </article>
    </Card>
  );
}
