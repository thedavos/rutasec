import { Link, useRouterState } from "@tanstack/react-router";

import { Button } from "#/shared/presentation/ui/button";
import { cn } from "#/shared/utils";

export type MainNavLinkProps = {
  to: string;
  label: string;
  isActive?: (pathname: string) => boolean;
};

export function MainNavLink({ to, label, isActive }: MainNavLinkProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const active = isActive ? isActive(pathname) : undefined;

  return (
    <Button variant="ghost" size="sm" asChild className="font-semibold">
      <Link
        to={to}
        className={active === undefined ? "nav-link" : cn("nav-link", active && "is-active")}
        aria-current={active ? "page" : undefined}
        {...(active === undefined
          ? { activeProps: { className: "is-active", "aria-current": "page" } }
          : {})}
      >
        {label}
      </Link>
    </Button>
  );
}
