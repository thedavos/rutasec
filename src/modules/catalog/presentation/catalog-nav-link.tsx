import { Compass } from "lucide-react";

import { isCatalogNavActive } from "#/modules/catalog/presentation/catalog-nav-active";
import { MainNavLink } from "#/shared/presentation/layout/main-nav-link";

export function CatalogNavLink() {
  return (
    <MainNavLink
      to="/"
      label="Catalog"
      icon={<Compass className="size-4" aria-hidden />}
      isActive={isCatalogNavActive}
    />
  );
}
