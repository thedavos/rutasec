import { Link } from "@tanstack/react-router";

import type { CatalogResourceDetail } from "#/modules/catalog/domain/entities/resource";
import { ResourceAttribution } from "#/modules/catalog/presentation/components/resource-attribution";
import { ResourceSiteIcon } from "#/modules/catalog/presentation/components/resource-site-icon";
import { detailAttributionDescription } from "#/modules/catalog/presentation/copy/transparency-copy";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";
import { SaveToLibraryCta } from "#/modules/library/presentation/save-to-library-cta";
import { ResourceProgressPanel } from "#/modules/library/presentation/resource-progress-panel";
import * as m from "#/paraglide/messages.js";
import { levelLabel, resourceTypeLabel } from "#/shared/i18n/resource-labels";
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
  isSaved: boolean;
  userResource: SavedUserResource | null;
};

const detailCardClassName = cn(
  "island-shell gap-0 rounded-2xl border-[var(--border-default)] py-0 shadow-none",
);

function TaxonomyTrail({ resource }: { resource: CatalogResourceDetail }) {
  const segments = [resource.phase, resource.category, resource.topic];
  if (resource.subtopic) {
    segments.push(resource.subtopic);
  }

  return (
    <p className="mt-3 text-sm text-[var(--text-secondary)]">
      {segments.map((segment, index) => (
        <span key={`${segment}-${index}`}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          {segment}
        </span>
      ))}
    </p>
  );
}

export function ResourceDetailPage({ resource, isSaved, userResource }: ResourceDetailPageProps) {
  return (
    <div className="pb-16">
      <nav aria-label={m.detail_breadcrumb_aria()} className="rise-in mb-6">
        <Button variant="ghost" size="sm" asChild className="h-auto px-0 py-0 font-semibold">
          <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            {m.detail_back_to_resources()}
          </Link>
        </Button>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-8">
          <header className="rise-in">
            <div className="mb-3">
              <ResourceSiteIcon
                iconUrl={resource.iconUrl}
                resourceType={resource.resourceType}
                size="md"
              />
            </div>

            <h1 className="display-title text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
              {resource.title}
            </h1>

            {resource.description ? (
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)]">
                {resource.description}
              </p>
            ) : null}

            <TaxonomyTrail resource={resource} />

            {resource.roadmapSection ? (
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {m.detail_roadmap({ section: resource.roadmapSection })}
              </p>
            ) : null}
          </header>

          <div className="space-y-5">
            {resource.pathContext ? (
              <Card className={detailCardClassName}>
                <CardHeader className="gap-2 px-5 pt-5 pb-5">
                  <CardTitle className="display-title text-lg font-bold">
                    {m.detail_learning_path_title()}
                  </CardTitle>
                  <CardDescription className="text-[var(--text-secondary)]">
                    {m.detail_learning_path_step({
                      order: String(resource.pathContext.itemOrder),
                      total: String(resource.pathContext.totalItems),
                      pathTitle: resource.pathContext.pathTitle,
                    })}
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            {resource.tags.length > 0 ? (
              <Card className={detailCardClassName}>
                <CardHeader className="gap-2 px-5 pt-5 pb-0">
                  <CardTitle className="display-title text-lg font-bold">
                    {m.detail_tags_title()}
                  </CardTitle>
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
                <CardTitle className="display-title text-lg font-bold">
                  {m.detail_attribution_title()}
                </CardTitle>
                <CardDescription className="text-[var(--text-secondary)]">
                  {detailAttributionDescription()}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 pt-3 pb-5">
                <ResourceAttribution attribution={resource.attribution} />
              </CardContent>
            </Card>
          </div>
        </div>

        <aside className="rise-in lg:sticky lg:top-8">
          <Card className={detailCardClassName}>
            <CardHeader className="gap-2 px-5 pt-5 pb-0">
              <CardTitle className="display-title text-lg font-bold">
                {m.detail_actions_title()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-5 pt-3 pb-5">
              <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 text-sm text-[var(--text-secondary)]">
                <dt className="font-semibold text-[var(--text-primary)]">{m.detail_category()}</dt>
                <dd className="text-right">{resource.category}</dd>
                <dt className="font-semibold text-[var(--text-primary)]">{m.detail_level()}</dt>
                <dd className="text-right">{levelLabel(resource.level)}</dd>
                <dt className="font-semibold text-[var(--text-primary)]">{m.detail_type()}</dt>
                <dd className="text-right">{resourceTypeLabel(resource.resourceType)}</dd>
                {resource.isFree ? (
                  <>
                    <dt className="font-semibold text-[var(--text-primary)]">{m.detail_free()}</dt>
                    <dd className="text-right text-[var(--success)]">{m.badge_free()}</dd>
                  </>
                ) : null}
                <dt className="font-semibold text-[var(--text-primary)]">
                  {m.detail_estimated_time()}
                </dt>
                <dd className="text-right">{resource.estimatedHours}h</dd>
                {resource.language ? (
                  <>
                    <dt className="font-semibold text-[var(--text-primary)]">
                      {m.detail_language()}
                    </dt>
                    <dd className="text-right uppercase">{resource.language}</dd>
                  </>
                ) : null}
              </dl>

              <Separator className="bg-[var(--border-default)]" />

              <Button asChild className="w-full">
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {m.visit_resource()}
                </a>
              </Button>

              <SaveToLibraryCta
                resourceId={resource.id}
                signInRedirect={`/resources/${resource.id}`}
                initialIsSaved={isSaved}
              />

              {userResource ? (
                <ResourceProgressPanel
                  resourceId={resource.id}
                  initialUserResource={userResource}
                />
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
