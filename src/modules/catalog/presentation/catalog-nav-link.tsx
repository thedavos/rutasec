import { isCatalogNavActive } from "#/modules/catalog/presentation/catalog-nav-active";
import { MainNavLink } from "#/shared/presentation/layout/main-nav-link";

export function CatalogNavLink() {
  return <MainNavLink to="/" label="Catalog" isActive={isCatalogNavActive} />;
}
