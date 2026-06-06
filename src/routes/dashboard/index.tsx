import { createFileRoute, redirect } from "@tanstack/react-router";

import { getUserDashboardFn } from "#/modules/dashboard";
import { DashboardPage } from "#/modules/dashboard/presentation/dashboard-page";
import { getSessionFn } from "#/modules/identity/server/get-session";
import * as m from "#/paraglide/messages.js";

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: async ({ location }) => {
    const session = await getSessionFn();
    if (!session?.user) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.pathname },
      });
    }
  },
  loader: async () => getUserDashboardFn(),
  head: () => ({
    meta: [{ title: m.meta_dashboard_title() }],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  const dashboard = Route.useLoaderData();
  return <DashboardPage dashboard={dashboard} />;
}
