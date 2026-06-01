import type { PublicCatalogResult } from "#/modules/catalog/domain/entities/resource";
import { Card, CardDescription, CardHeader, CardTitle } from "#/shared/presentation/ui/card";
import { CatalogFiltersBar } from "#/modules/catalog/presentation/components/catalog-filters";
import { ResourceCard } from "#/modules/catalog/presentation/components/resource-card";

type CatalogPageProps = {
  catalog: PublicCatalogResult;
};

export function CatalogPage({ catalog }: CatalogPageProps) {
  return (
    <div className="pb-16">
      <header className="rise-in mb-8">
        <p className="island-kicker mb-2">Public catalog</p>
        <h1 className="display-title text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
          Cybersecurity learning resources
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--sea-ink-soft)]">
          Explore curated courses, labs, and guides for web pentesting and bug bounty fundamentals.
          No account required to browse.
        </p>
      </header>

      <CatalogFiltersBar
        filters={catalog.filters}
        filterOptions={catalog.filterOptions}
        total={catalog.total}
      />

      {catalog.resources.length === 0 ? (
        <Card className="island-shell mt-8 rounded-2xl border-[var(--line)] py-8 shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="display-title text-xl">No resources match</CardTitle>
            <CardDescription>
              Try a different search term, clearing filters, or choosing another category, level, or
              type.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.resources.map((resource) => (
            <li key={resource.id} className="rise-in">
              <ResourceCard resource={resource} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
