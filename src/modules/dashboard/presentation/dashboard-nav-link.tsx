import { LayoutDashboard } from "lucide-react";

import { MainNavLink } from "#/shared/presentation/layout/main-nav-link";

type DashboardNavLinkProps = {
  stacked?: boolean;
};

export function DashboardNavLink({ stacked = false }: DashboardNavLinkProps) {
  return (
    <MainNavLink
      to="/dashboard"
      label="Dashboard"
      icon={<LayoutDashboard className="size-4" aria-hidden />}
      stacked={stacked}
    />
  );
}
