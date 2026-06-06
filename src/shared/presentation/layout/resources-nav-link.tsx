import { LayoutGrid } from "lucide-react";

import * as m from "#/paraglide/messages.js";
import { MainNavLink } from "#/shared/presentation/layout/main-nav-link";

type ResourcesNavLinkProps = {
  stacked?: boolean;
};

export function ResourcesNavLink({ stacked = false }: ResourcesNavLinkProps) {
  return (
    <MainNavLink
      to="/"
      label={m.nav_resources()}
      icon={<LayoutGrid className="size-4" aria-hidden />}
      stacked={stacked}
    />
  );
}
