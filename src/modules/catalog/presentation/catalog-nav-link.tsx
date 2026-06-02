import { Link, useRouterState } from "@tanstack/react-router";

import { isCatalogNavActive } from "#/modules/catalog/presentation/catalog-nav-active";
import { Button } from "#/shared/presentation/ui/button";
import { cn } from "#/shared/utils";

export function CatalogNavLink() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isActive = isCatalogNavActive(pathname);

  return (
    <Button variant="ghost" size="sm" asChild className="font-semibold">
      <Link
        to="/"
        className={cn("nav-link", isActive && "is-active")}
        aria-current={isActive ? "page" : undefined}
      >
        Catalog
      </Link>
    </Button>
  );
}
