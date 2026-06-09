import { BookMarked } from "lucide-react";

import * as m from "#/paraglide/messages.js";
import { MainNavLink } from "#/shared/presentation/layout/main-nav-link";

type LibraryNavLinkProps = {
  stacked?: boolean;
};

export function LibraryNavLink({ stacked = false }: LibraryNavLinkProps) {
  return (
    <MainNavLink
      to="/library"
      label={m.nav_library()}
      icon={<BookMarked className="size-4" aria-hidden />}
      stacked={stacked}
    />
  );
}
