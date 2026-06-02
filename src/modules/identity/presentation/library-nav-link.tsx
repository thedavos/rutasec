import { Link } from "@tanstack/react-router";

import { authClient } from "#/modules/identity";
import { Button } from "#/shared/presentation/ui/button";

export function LibraryNavLink() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session?.user) {
    return null;
  }

  return (
    <Button variant="ghost" size="sm" asChild className="font-semibold">
      <Link
        to="/library"
        className="nav-link"
        activeProps={{ className: "is-active", "aria-current": "page" }}
      >
        Library
      </Link>
    </Button>
  );
}
