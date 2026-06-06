import { Link } from "@tanstack/react-router";

import type { PersonalLibrary } from "#/modules/library/domain/entities/personal-library-item";
import { LibraryItemCard } from "#/modules/library/presentation/components/library-item-card";
import { LibraryStatusFilters } from "#/modules/library/presentation/components/library-status-filters";
import * as m from "#/paraglide/messages.js";
import { Button } from "#/shared/presentation/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "#/shared/presentation/ui/card";

type PersonalLibraryPageProps = {
  library: PersonalLibrary;
};

export function PersonalLibraryPage({ library }: PersonalLibraryPageProps) {
  return (
    <div className="pb-16">
      <header className="rise-in mb-8">
        <p className="island-kicker mb-2">{m.library_kicker()}</p>
        <h1 className="display-title text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
          {m.library_title()}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
          {m.library_description()}
        </p>
      </header>

      <LibraryStatusFilters statusFilter={library.statusFilter} total={library.items.length} />

      {library.items.length === 0 ? (
        <Card className="island-shell mt-8 rounded-2xl border-[var(--border-default)] py-8 shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="display-title text-xl">
              {library.statusFilter ? m.library_empty_filtered_title() : m.library_empty_title()}
            </CardTitle>
            <CardDescription>
              {library.statusFilter
                ? m.library_empty_filtered_description()
                : m.library_empty_description()}
            </CardDescription>
            <Button asChild className="mt-4">
              <Link to="/">{m.action_browse_catalog()}</Link>
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
