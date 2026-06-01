import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSessionFn } from "#/modules/identity/server/get-session";
import { listUserGoalsFn } from "#/modules/goals";
import { GoalsPage } from "#/modules/goals/presentation/goals-page";

export const Route = createFileRoute("/goals/")({
  beforeLoad: async ({ location }) => {
    const session = await getSessionFn();
    if (!session?.user) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.pathname },
      });
    }
  },
  loader: async () => listUserGoalsFn(),
  head: () => ({
    meta: [{ title: "Your goals — RutaSec" }],
  }),
  component: GoalsRoute,
});

function GoalsRoute() {
  const goals = Route.useLoaderData();
  return <GoalsPage goals={goals} />;
}
