import { Link } from "@tanstack/react-router";

import type { PersonalLibrary } from "#/modules/library/domain/entities/personal-library-item";
import { LibraryItemCard } from "#/modules/library/presentation/components/library-item-card";
import { LibraryStatusFilters } from "#/modules/library/presentation/components/library-status-filters";
import { Button } from "#/shared/presentation/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "#/shared/presentation/ui/card";

type PersonalLibraryPageProps = {
  library: PersonalLibrary;
};

export function PersonalLibraryPage({ library }: PersonalLibraryPageProps) {
  return (
    <div className="pb-16">
      <header className="rise-in mb-8">
        <p className="island-kicker mb-2">Personal library</p>
        <h1 className="display-title text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
          Your saved resources
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--sea-ink-soft)]">
          Resources you saved from the catalog. Open a card for full detail or continue browsing to
          add more.
        </p>
      </header>

      <LibraryStatusFilters statusFilter={library.statusFilter} total={library.items.length} />

      {library.items.length === 0 ? (
        <Card className="island-shell mt-8 rounded-2xl border-[var(--line)] py-8 shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="display-title text-xl">
              {library.statusFilter ? "No resources with this status" : "Nothing saved yet"}
            </CardTitle>
            <CardDescription>
              {library.statusFilter
                ? "Try another status filter or save resources from the public catalog."
                : "Browse the catalog and use Save to library on any resource you want to track."}
            </CardDescription>
            <Button asChild className="mt-4">
              <Link to="/">Browse catalog</Link>
            </Button>
          </CardHeader>
        </Card>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {library.items.map((item) => (
            <li key={item.userResourceId} className="rise-in">
              <LibraryItemCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
