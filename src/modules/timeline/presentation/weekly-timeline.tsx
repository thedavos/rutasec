import { Link } from "@tanstack/react-router";

import type { TimelineWeek } from "#/modules/timeline/presentation/group-study-plan-items-by-week";
import * as m from "#/paraglide/messages.js";
import { formatWeekResourceCount, studyPlanItemStatusLabel } from "#/shared/i18n/resource-labels";
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
      <Card className="island-shell rounded-2xl border-[var(--border-default)] py-6 shadow-none">
        <CardHeader>
          <CardTitle className="display-title text-lg">{m.timeline_empty_title()}</CardTitle>
          <CardDescription>{m.timeline_empty_description()}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <ol className="grid gap-4">
      {weeks.map((week) => (
        <li key={week.weekNumber}>
          <Card className="island-shell rounded-2xl border-[var(--border-default)] shadow-none">
            <CardHeader className="gap-2">
              <p className="island-kicker mb-0">
                {m.timeline_week_label({ number: String(week.weekNumber) })}
              </p>
              <CardDescription>{formatWeekResourceCount(week.items.length)}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {week.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-default)] pt-3 first:border-t-0 first:pt-0"
                  >
                    <Link
                      to="/resources/$id"
                      params={{ id: item.resourceId }}
                      className="font-semibold text-[var(--text-primary)] no-underline hover:text-[var(--primary-hover)]"
                    >
                      {item.title}
                    </Link>
                    <Badge variant="outline">{studyPlanItemStatusLabel(item.status)}</Badge>
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
