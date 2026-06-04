import { CatalogNavLink } from "#/modules/catalog/presentation/catalog-nav-link";
import { DashboardNavLink } from "#/modules/dashboard/presentation/dashboard-nav-link";
import { GoalsNavLink } from "#/modules/goals/presentation/goals-nav-link";
import { authClient } from "#/modules/identity";
import { LibraryNavLink } from "#/modules/identity/presentation/library-nav-link";

export function AuthenticatedNavGroup() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto rounded-md border border-[var(--border-default)] bg-[var(--surface)] p-1">
      <CatalogNavLink />
      <DashboardNavLink />
      <LibraryNavLink />
      <GoalsNavLink />
    </div>
  );
}
