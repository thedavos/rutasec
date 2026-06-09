import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { getPublicCatalogFn } from "#/modules/catalog";
import { LibraryItemCard } from "#/modules/library/presentation/components/library-item-card";
import { GuestLibrarySyncBanner } from "#/modules/library/presentation/guest-library/guest-library-sync-banner";
import { mapGuestEntriesToLibraryItems } from "#/modules/library/presentation/guest-library/map-guest-library-items";
import { useGuestLibraryEntries } from "#/modules/library/presentation/guest-library/use-guest-library";
import * as m from "#/paraglide/messages.js";
import { formatLibrarySavedCount } from "#/shared/i18n/resource-labels";
import { Button } from "#/shared/presentation/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "#/shared/presentation/ui/card";
import { Skeleton } from "#/shared/presentation/ui/skeleton";

export function GuestLibraryPage() {
  const guestEntriesQuery = useGuestLibraryEntries();
  const catalogQuery = useQuery({
    queryKey: ["guest-library", "catalog"],
    queryFn: () => getPublicCatalogFn({ data: {} }),
  });

  const isLoading = guestEntriesQuery.isPending || catalogQuery.isPending;
  const guestEntries = guestEntriesQuery.data ?? [];
  const visibleEntries = guestEntries.filter(
    (entry) => entry.syncStatus === "pending" || entry.syncStatus === "failed",
  );
  const items =
    catalogQuery.data?.resources && visibleEntries.length > 0
      ? mapGuestEntriesToLibraryItems(visibleEntries, catalogQuery.data.resources)
      : [];

  return (
    <div className="pb-16">
      <header className="rise-in mb-8">
        <p className="island-kicker mb-2">{m.guest_library_kicker()}</p>
        <h1 className="display-title text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
          {m.guest_library_title()}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
          {m.guest_library_description()}
        </p>
      </header>

      <GuestLibrarySyncBanner />

      {isLoading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="island-shell mt-8 rounded-2xl border-[var(--border-default)] py-8 shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="display-title text-xl">{m.library_empty_title()}</CardTitle>
            <CardDescription>{m.guest_library_empty_description()}</CardDescription>
            <Button asChild className="mt-4">
              <Link to="/">{m.action_browse_catalog()}</Link>
            </Button>
          </CardHeader>
        </Card>
      ) : (
        <>
          <p className="text-sm text-[var(--text-secondary)]">
            {formatLibrarySavedCount(items.length)}
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.userResourceId} className="rise-in">
                <LibraryItemCard item={item} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
