import { Link } from "@tanstack/react-router";

import type { CatalogResourceCard } from "#/modules/catalog/domain/entities/resource";
import { ResourceAttribution } from "#/modules/catalog/presentation/components/resource-attribution";
import { Badge } from "#/shared/presentation/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/shared/presentation/ui/card";
import { Separator } from "#/shared/presentation/ui/separator";
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
    <Card className={cn("feature-card island-shell h-full gap-0 rounded-2xl py-0 shadow-none")}>
      <CardHeader className="gap-3 px-5 pt-5 pb-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="island-kicker rounded-full border-[var(--chip-line)]"
          >
            {resource.category}
          </Badge>
          <Badge variant="outline">{levelLabels[resource.level]}</Badge>
          <Badge variant="outline">{typeLabels[resource.resourceType]}</Badge>
          {resource.isFree ? (
            <Badge className="border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--palm)]">
              Free
            </Badge>
          ) : null}
        </div>
        <CardTitle className="display-title text-xl font-bold leading-tight">
          <Link
            to="/resources/$id"
            params={{ id: resource.id }}
            className="text-[var(--sea-ink)] no-underline hover:text-[var(--lagoon-deep)]"
          >
            {resource.title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col px-5 pt-3 pb-0">
        {resource.description ? (
          <CardDescription className="line-clamp-3 text-sm leading-relaxed text-[var(--sea-ink-soft)]">
            {resource.description}
          </CardDescription>
        ) : null}

        <dl className="mt-4 grid gap-1 text-xs text-[var(--sea-ink-soft)]">
          <div className="flex gap-2">
            <dt className="font-semibold text-[var(--sea-ink)]">Topic</dt>
            <dd>{resource.topic}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-[var(--sea-ink)]">Hours</dt>
            <dd>{resource.estimatedHours}h estimated</dd>
          </div>
        </dl>
      </CardContent>

      <CardFooter className="flex-col items-start gap-0 px-5 pt-4 pb-5">
        <Separator className="mb-3 bg-[var(--line)]" />
        <ResourceAttribution attribution={resource.attribution} variant="compact" />
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-xs font-semibold text-[var(--lagoon-deep)] underline-offset-2 hover:underline"
        >
          Visit resource
        </a>
      </CardFooter>
    </Card>
  );
}
