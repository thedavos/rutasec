import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Button } from "#/shared/presentation/ui/button";
import { cn } from "#/shared/utils";

export type MainNavLinkProps = {
  to: string;
  label: string;
  icon?: ReactNode;
  isActive?: (pathname: string) => boolean;
  stacked?: boolean;
};

const NAV_LINK_BASE = "nav-link inline-flex items-center gap-1.5";

export function MainNavLink({ to, label, icon, isActive, stacked = false }: MainNavLinkProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const active = isActive ? isActive(pathname) : undefined;

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className={cn("font-semibold", stacked && "h-10 w-full justify-start")}
    >
      <Link
        to={to}
        className={active === undefined ? NAV_LINK_BASE : cn(NAV_LINK_BASE, active && "is-active")}
        aria-current={active ? "page" : undefined}
        {...(active === undefined
          ? { activeProps: { className: "is-active", "aria-current": "page" } }
          : {})}
      >
        {icon}
        {label}
      </Link>
    </Button>
  );
}
