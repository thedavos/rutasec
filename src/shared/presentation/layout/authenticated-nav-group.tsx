import { DashboardNavLink } from "#/modules/dashboard/presentation/dashboard-nav-link";
import { authClient } from "#/modules/identity";
import { GithubNavLink } from "#/shared/presentation/layout/github-nav-link";
import {
  navGroupContainerClass,
  type NavGroupLayout,
} from "#/shared/presentation/layout/nav-group-layout";
import { ResourcesNavLink } from "#/shared/presentation/layout/resources-nav-link";
import { SendResourceNavLink } from "#/shared/presentation/layout/send-resource-nav-link";

type AuthenticatedNavGroupProps = {
  layout?: NavGroupLayout;
};

export function AuthenticatedNavGroup({ layout = "inline" }: AuthenticatedNavGroupProps) {
  const { data: session, isPending } = authClient.useSession();
  const stacked = layout === "stacked";

  if (isPending || !session?.user) {
    return null;
  }

  return (
    <div className={navGroupContainerClass(layout)}>
      <ResourcesNavLink stacked={stacked} />
      <DashboardNavLink stacked={stacked} />
      <GithubNavLink stacked={stacked} />
      <SendResourceNavLink stacked={stacked} />
    </div>
  );
}
