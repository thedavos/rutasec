import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { listGoalLinkedResourcesFn, listUserGoalsFn } from "#/modules/goals";
import { getSessionFn } from "#/modules/identity/server/get-session";
import { getStudyPlanForGoalFn } from "#/modules/timeline";
import { GoalTimelinePage } from "#/modules/timeline/presentation/goal-timeline-page";
import { groupStudyPlanItemsByWeek } from "#/modules/timeline/presentation/group-study-plan-items-by-week";

export const Route = createFileRoute("/goals/$goalId/timeline")({
  beforeLoad: async ({ location }) => {
    const session = await getSessionFn();
    if (!session?.user) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.pathname },
      });
    }
  },
  loader: async ({ params }) => {
    const { goalId } = params;

    const [goals, linkedResources, plan] = await Promise.all([
      listUserGoalsFn(),
      listGoalLinkedResourcesFn(),
      getStudyPlanForGoalFn({ data: { goalId } }),
    ]);

    const goal = goals.goals.find((entry) => entry.id === goalId);
    if (!goal) {
      throw notFound();
    }

    const titleByResourceId = new Map(
      linkedResources
        .filter((resource) => resource.goalId === goalId)
        .map((resource) => [resource.resourceId, resource.title] as const),
    );

    const weeks = plan ? groupStudyPlanItemsByWeek(plan.items, titleByResourceId) : [];

    return { goal, plan, weeks };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.goal.title ?? "Goal"} — Study timeline — RutaSec` }],
  }),
  component: GoalTimelineRoute,
});

function GoalTimelineRoute() {
  const { goal, plan, weeks } = Route.useLoaderData();
  return <GoalTimelinePage goal={goal} plan={plan} weeks={weeks} />;
}
