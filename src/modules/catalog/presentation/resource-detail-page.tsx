import { Link } from "@tanstack/react-router";

import type { CatalogResourceDetail } from "#/modules/catalog/domain/entities/resource";
import { SaveToLibraryCta } from "#/modules/library/presentation/save-to-library-cta";
import { Badge } from "#/shared/presentation/ui/badge";
import { Button } from "#/shared/presentation/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/presentation/ui/card";
import { Separator } from "#/shared/presentation/ui/separator";
import { cn } from "#/shared/utils";

type ResourceDetailPageProps = {
  resource: CatalogResourceDetail;
};

const levelLabels: Record<CatalogResourceDetail["level"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const typeLabels: Record<CatalogResourceDetail["resourceType"], string> = {
  course: "Course",
  book: "Book",
  documentation: "Docs",
  video: "Video",
  lab: "Lab",
  tool: "Tool",
  article: "Article",
};

const detailCardClassName = cn(
  "island-shell gap-0 rounded-2xl border-[var(--line)] py-0 shadow-none",
);

function TaxonomyTrail({ resource }: { resource: CatalogResourceDetail }) {
  const segments = [resource.phase, resource.category, resource.topic];
  if (resource.subtopic) {
    segments.push(resource.subtopic);
  }

  return (
    <p className="mt-3 text-sm text-[var(--sea-ink-soft)]">
      {segments.map((segment, index) => (
        <span key={`${segment}-${index}`}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          {segment}
        </span>
      ))}
    </p>
  );
}

export function ResourceDetailPage({ resource }: ResourceDetailPageProps) {
  return (
    <div className="pb-16">
      <nav aria-label="Breadcrumb" className="rise-in mb-6">
        <Button variant="ghost" size="sm" asChild className="h-auto px-0 py-0 font-semibold">
          <Link to="/" className="text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]">
            ← Back to catalog
          </Link>
        </Button>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-8">
          <header className="rise-in">
            <div className="mb-3 flex flex-wrap items-center gap-2">
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

            <h1 className="display-title text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
              {resource.title}
            </h1>

            {resource.description ? (
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--sea-ink-soft)]">
                {resource.description}
              </p>
            ) : null}

            <TaxonomyTrail resource={resource} />

            {resource.roadmapSection ? (
              <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
                Roadmap: {resource.roadmapSection}
              </p>
            ) : null}
          </header>

          <div className="space-y-5">
            {resource.pathContext ? (
              <Card className={detailCardClassName}>
                <CardHeader className="gap-2 px-5 pt-5 pb-5">
                  <CardTitle className="display-title text-lg font-bold">Learning path</CardTitle>
                  <CardDescription className="text-[var(--sea-ink-soft)]">
                    Step {resource.pathContext.itemOrder} of {resource.pathContext.totalItems} in{" "}
                    {resource.pathContext.pathTitle}
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            {resource.tags.length > 0 ? (
              <Card className={detailCardClassName}>
                <CardHeader className="gap-2 px-5 pt-5 pb-0">
                  <CardTitle className="display-title text-lg font-bold">Tags</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pt-3 pb-5">
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <Card className={detailCardClassName}>
              <CardHeader className="gap-2 px-5 pt-5 pb-0">
                <CardTitle className="display-title text-lg font-bold">Attribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-5 pt-3 pb-5 text-sm leading-relaxed text-[var(--sea-ink-soft)]">
                <p>
                  Source:{" "}
                  <a
                    href={resource.attribution.originalSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[var(--sea-ink)] underline-offset-2 hover:underline"
                  >
                    {resource.attribution.originalSourceName}
                  </a>
                </p>
                <p>
                  Curated from:{" "}
                  <a
                    href={resource.attribution.curatedFromUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[var(--sea-ink)] underline-offset-2 hover:underline"
                  >
                    {resource.attribution.curatedFromName}
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <aside className="rise-in lg:sticky lg:top-24">
          <Card className={detailCardClassName}>
            <CardHeader className="gap-2 px-5 pt-5 pb-0">
              <CardTitle className="display-title text-lg font-bold">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-5 pt-3 pb-5">
              <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 text-sm text-[var(--sea-ink-soft)]">
                <dt className="font-semibold text-[var(--sea-ink)]">Estimated time</dt>
                <dd className="text-right">{resource.estimatedHours}h</dd>
                {resource.language ? (
                  <>
                    <dt className="font-semibold text-[var(--sea-ink)]">Language</dt>
                    <dd className="text-right uppercase">{resource.language}</dd>
                  </>
                ) : null}
              </dl>

              <Separator className="bg-[var(--line)]" />

              <Button asChild className="w-full">
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  Visit resource
                </a>
              </Button>

              <SaveToLibraryCta
                resourceId={resource.id}
                signInRedirect={`/resources/${resource.id}`}
              />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
