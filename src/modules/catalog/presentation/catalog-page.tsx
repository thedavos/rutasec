import type {
  CatalogResourceCard,
  PublicCatalogResult,
} from "#/modules/catalog/domain/entities/resource";
import { CatalogFiltersBar } from "#/modules/catalog/presentation/components/catalog-filters";
import { ResourceCard } from "#/modules/catalog/presentation/components/resource-card";
import { Card, CardDescription, CardHeader, CardTitle } from "#/shared/presentation/ui/card";

type CatalogPageProps = {
  catalog: PublicCatalogResult;
};

type CatalogResourceGroup = {
  category: string;
  resources: CatalogResourceCard[];
  topics: string[];
};

function slugifyCategory(category: string) {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function groupResourcesByCategory(
  resources: CatalogResourceCard[],
  categoryOrder: string[],
): CatalogResourceGroup[] {
  const groups = new Map<string, CatalogResourceCard[]>();

  for (const resource of resources) {
    const categoryResources = groups.get(resource.category) ?? [];
    categoryResources.push(resource);
    groups.set(resource.category, categoryResources);
  }

  const orderedCategories = [
    ...categoryOrder.filter((category) => groups.has(category)),
    ...Array.from(groups.keys()).filter((category) => !categoryOrder.includes(category)),
  ];

  return orderedCategories.map((category) => {
    const categoryResources = groups.get(category) ?? [];
    return {
      category,
      resources: categoryResources,
      topics: Array.from(new Set(categoryResources.map((resource) => resource.topic))).slice(0, 4),
    };
  });
}

function categorySectionIds(category: string) {
  const categorySlug = slugifyCategory(category);
  return {
    sectionId: `catalog-category-${categorySlug}`,
    headingId: `catalog-category-heading-${categorySlug}`,
  };
}

function formatResourceCount(count: number) {
  return `${count} resource${count === 1 ? "" : "s"}`;
}

export function CatalogPage({ catalog }: CatalogPageProps) {
  const groupedResources = groupResourcesByCategory(
    catalog.resources,
    catalog.filterOptions.categories,
  );
  const hasFilters = Boolean(
    catalog.filters.category ||
    catalog.filters.level ||
    catalog.filters.resourceType ||
    catalog.filters.q,
  );

  return (
    <div className="pb-16">
      <header className="rise-in mt-6 mb-14 text-center sm:mt-10 sm:mb-20">
        <h1 className="display-title text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
          Cybersecurity learning resources
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
          Curated courses, labs, and guides for web pentesting and bug bounty fundamentals
        </p>
      </header>

      <CatalogFiltersBar
        filters={catalog.filters}
        filterOptions={catalog.filterOptions}
        resultLabel={`${formatResourceCount(catalog.resources.length)}${
          hasFilters ? " shown after filters" : " available"
        }`}
      />

      <section className="rise-in mt-12 md:mt-20" aria-label="Catalog resources">
        {catalog.resources.length === 0 ? (
          <Card className="island-shell mt-8 rounded-2xl border-[var(--border-default)] py-8 shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="display-title text-xl">No resources match</CardTitle>
              <CardDescription>
                Try a different search term, clearing filters, or choosing another category, level,
                or type.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-8">
            {groupedResources.map((group, index) => {
              const { sectionId, headingId } = categorySectionIds(group.category);
              return (
                <section
                  key={group.category}
                  id={sectionId}
                  className="scroll-mt-36"
                  aria-labelledby={headingId}
                >
                  <div
                    className={`mb-4 pt-4 ${
                      index > 0 ? "border-t border-[var(--border-default)]" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3
                        id={headingId}
                        className="display-title text-xl font-bold text-[var(--text-primary)]"
                      >
                        {group.category}
                      </h3>
                      <p className="text-sm font-semibold text-[var(--text-secondary)]">
                        {formatResourceCount(group.resources.length)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                      Focus: {group.topics.join(", ")}
                      {group.topics.length === 4 ? ", and related topics" : ""}.
                    </p>
                  </div>
                  <ul className="grid gap-4 lg:grid-cols-2">
                    {group.resources.map((resource) => (
                      <li key={resource.id}>
                        <ResourceCard resource={resource} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
