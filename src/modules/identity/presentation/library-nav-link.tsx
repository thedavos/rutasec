import { BookMarked } from "lucide-react";

import { MainNavLink } from "#/shared/presentation/layout/main-nav-link";

export function LibraryNavLink() {
  return (
    <MainNavLink
      to="/library"
      label="Library"
      icon={<BookMarked className="size-4" aria-hidden />}
    />
  );
}
