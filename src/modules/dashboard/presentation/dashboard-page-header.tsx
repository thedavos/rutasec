import type { ReactNode } from "react";

import { DashboardQuickActions } from "#/modules/dashboard/presentation/dashboard-quick-actions";

type DashboardPageHeaderProps = {
  children: ReactNode;
};

export function DashboardPageHeader({ children }: DashboardPageHeaderProps) {
  return (
    <header className="rise-in mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">{children}</div>
      <DashboardQuickActions />
    </header>
  );
}
