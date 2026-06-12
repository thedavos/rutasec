import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSessionFn } from "#/modules/identity/server/get-session";
import { getPersonalLibraryFn } from "#/modules/library";
import { listGoalLinkedResourcesFn, listUserGoalsFn } from "#/modules/goals";
import { GoalsPage } from "#/modules/goals/presentation/goals-page";
import * as m from "#/paraglide/messages.js";
import { buildPageHead } from "#/shared/presentation/seo/build-page-head";

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
  loader: async () => {
    const [goals, library, linkedResources] = await Promise.all([
      listUserGoalsFn(),
      getPersonalLibraryFn({ data: {} }),
      listGoalLinkedResourcesFn(),
    ]);

    return { goals, library, linkedResources };
  },
  head: () =>
    buildPageHead({
      title: m.meta_goals_title(),
      description: m.goals_description(),
      path: "/goals",
    }),
  component: GoalsRoute,
});

function GoalsRoute() {
  const { goals, library, linkedResources } = Route.useLoaderData();
  return <GoalsPage goals={goals} library={library} linkedResources={linkedResources} />;
}
