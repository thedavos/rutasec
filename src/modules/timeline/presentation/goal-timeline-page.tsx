import { Link } from "@tanstack/react-router";

import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type { StudyPlan } from "#/modules/timeline/domain/entities/study-plan";
import { GenerateStudyPlanButton } from "#/modules/timeline/presentation/generate-study-plan-button";
import type { TimelineWeek } from "#/modules/timeline/presentation/group-study-plan-items-by-week";
import { WeeklyTimeline } from "#/modules/timeline/presentation/weekly-timeline";
import * as m from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";
import { goalStatusLabel, studyPlanStatusLabel } from "#/shared/i18n/resource-labels";
import { Badge } from "#/shared/presentation/ui/badge";
import { Button } from "#/shared/presentation/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/presentation/ui/card";

type GoalTimelinePageProps = {
  goal: LearningGoal;
  plan: StudyPlan | null;
  weeks: TimelineWeek[];
};

export function GoalTimelinePage({ goal, plan, weeks }: GoalTimelinePageProps) {
  const locale = getLocale();

  return (
    <div className="pb-16">
      <header className="rise-in mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 w-fit">
          <Link to="/goals">{m.timeline_back_to_goals()}</Link>
        </Button>
        <p className="island-kicker mb-2">{m.timeline_kicker()}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{goalStatusLabel(goal.status)}</Badge>
          <Badge
            variant="secondary"
            className="island-kicker rounded-full border-[var(--primary-border)]"
          >
            {m.goal_hours_per_week({ hours: String(goal.hoursPerWeek) })}
          </Badge>
        </div>
        <h1 className="display-title mt-3 text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
          {goal.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
          {m.timeline_description()}
        </p>
      </header>

      {!plan ? (
        <Card className="island-shell rounded-2xl border-[var(--border-default)] py-8 shadow-none">
          <CardHeader>
            <CardTitle className="display-title text-xl">{m.timeline_no_plan_title()}</CardTitle>
            <CardDescription>{m.timeline_no_plan_description()}</CardDescription>
            <CardContent className="px-0 pt-4">
              <GenerateStudyPlanButton goalId={goal.id} />
            </CardContent>
          </CardHeader>
        </Card>
      ) : (
        <>
          <Card className="island-shell mb-8 rounded-2xl border-[var(--border-default)] shadow-none">
            <CardHeader className="gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{studyPlanStatusLabel(plan.status)}</Badge>
                <Badge variant="secondary">
                  {m.timeline_weeks_badge({ weeks: String(plan.estimatedWeeks) })}
                </Badge>
                <Badge variant="secondary">
                  {m.timeline_hours_total_badge({ hours: String(plan.totalEstimatedHours) })}
                </Badge>
              </div>
              <CardTitle className="display-title text-xl font-bold text-[var(--text-primary)]">
                {plan.title}
              </CardTitle>
              <CardDescription>
                {m.timeline_generated({
                  date: new Date(plan.createdAt).toLocaleDateString(locale),
                })}
              </CardDescription>
            </CardHeader>
          </Card>

          <WeeklyTimeline weeks={weeks} />
        </>
      )}
    </div>
  );
}
