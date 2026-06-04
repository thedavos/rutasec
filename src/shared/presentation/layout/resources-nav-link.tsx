import { LayoutGrid } from "lucide-react";

import { MainNavLink } from "#/shared/presentation/layout/main-nav-link";

type ResourcesNavLinkProps = {
  stacked?: boolean;
};

export function ResourcesNavLink({ stacked = false }: ResourcesNavLinkProps) {
  return (
    <MainNavLink
      to="/"
      label="Resources"
      icon={<LayoutGrid className="size-4" aria-hidden />}
      stacked={stacked}
    />
  );
}
