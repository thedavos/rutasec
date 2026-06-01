import { createFileRoute, redirect } from "@tanstack/react-router";

import { getUserDashboardFn } from "#/modules/dashboard";
import { DashboardPage } from "#/modules/dashboard/presentation/dashboard-page";
import { getSessionFn } from "#/modules/identity/server/get-session";

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
    meta: [{ title: "Your dashboard — RutaSec" }],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  const dashboard = Route.useLoaderData();
  return <DashboardPage dashboard={dashboard} />;
}
