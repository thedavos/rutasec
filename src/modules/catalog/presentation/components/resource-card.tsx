import { Link } from "@tanstack/react-router";

import type { CatalogResourceCard } from "#/modules/catalog/domain/entities/resource";
import { AddToLibraryButton } from "#/modules/library/presentation/add-to-library-button";
import { Badge } from "#/shared/presentation/ui/badge";
import { Button } from "#/shared/presentation/ui/button";
import { Card } from "#/shared/presentation/ui/card";
import { cn } from "#/shared/utils";

type ResourceCardProps = {
  resource: CatalogResourceCard;
};

const levelLabels: Record<CatalogResourceCard["level"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const typeLabels: Record<CatalogResourceCard["resourceType"], string> = {
  course: "Course",
  book: "Book",
  documentation: "Docs",
  video: "Video",
  lab: "Lab",
  tool: "Tool",
  article: "Article",
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className={cn("feature-card island-shell h-full gap-0 rounded-xl py-0 shadow-none")}>
      <article className="flex h-full flex-col gap-4 px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{levelLabels[resource.level]}</Badge>
            <Badge variant="outline">{typeLabels[resource.resourceType]}</Badge>
            {resource.isFree ? (
              <Badge className="border-[var(--primary-border)] bg-[var(--primary-soft)] font-mono text-[var(--success)]">
                Free
              </Badge>
            ) : null}
          </div>
          <h4 className="display-title mt-2 text-lg font-bold leading-tight">
            <Link
              to="/resources/$id"
              params={{ id: resource.id }}
              className="text-[var(--text-primary)] no-underline hover:text-[var(--primary-hover)]"
            >
              {resource.title}
            </Link>
          </h4>

          {resource.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {resource.description}
            </p>
          ) : null}

          <dl className="type-mono mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
            <div className="flex gap-2">
              <dt className="font-semibold text-[var(--text-primary)]">Topic</dt>
              <dd>{resource.topic}</dd>
            </div>
            {resource.subtopic ? (
              <div className="flex gap-2">
                <dt className="font-semibold text-[var(--text-primary)]">Subtopic</dt>
                <dd>{resource.subtopic}</dd>
              </div>
            ) : null}
            <div className="flex gap-2">
              <dt className="font-semibold text-[var(--text-primary)]">Hours</dt>
              <dd>{resource.estimatedHours}h</dd>
            </div>
          </dl>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="text-white">
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              Visit resource
            </a>
          </Button>
          <AddToLibraryButton resourceId={resource.id} />
        </div>
      </article>
    </Card>
  );
}
