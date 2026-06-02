import { Link } from "@tanstack/react-router";

import type { TimelineWeek } from "#/modules/timeline/presentation/group-study-plan-items-by-week";
import { studyPlanItemStatusLabels } from "#/modules/timeline/presentation/timeline-labels";
import { Badge } from "#/shared/presentation/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/presentation/ui/card";

type WeeklyTimelineProps = {
  weeks: TimelineWeek[];
};

export function WeeklyTimeline({ weeks }: WeeklyTimelineProps) {
  if (weeks.length === 0) {
    return (
      <Card className="island-shell rounded-2xl border-[var(--line)] py-6 shadow-none">
        <CardHeader>
          <CardTitle className="display-title text-lg">No scheduled resources</CardTitle>
          <CardDescription>
            All linked resources are completed or discarded, so nothing remains in this plan.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <ol className="grid gap-4">
      {weeks.map((week) => (
        <li key={week.weekNumber}>
          <Card className="island-shell rounded-2xl border-[var(--line)] shadow-none">
            <CardHeader className="gap-2">
              <p className="island-kicker mb-0">Week {week.weekNumber}</p>
              <CardDescription>
                {week.items.length} resource{week.items.length === 1 ? "" : "s"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {week.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-3 first:border-t-0 first:pt-0"
                  >
                    <Link
                      to="/resources/$id"
                      params={{ id: item.resourceId }}
                      className="font-semibold text-[var(--sea-ink)] no-underline hover:text-[var(--lagoon-deep)]"
                    >
                      {item.title}
                    </Link>
                    <Badge variant="outline">{studyPlanItemStatusLabels[item.status]}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </li>
      ))}
    </ol>
  );
}
