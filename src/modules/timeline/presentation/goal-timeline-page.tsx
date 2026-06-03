import { Link } from "@tanstack/react-router";

import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type { StudyPlan } from "#/modules/timeline/domain/entities/study-plan";
import { GenerateStudyPlanButton } from "#/modules/timeline/presentation/generate-study-plan-button";
import type { TimelineWeek } from "#/modules/timeline/presentation/group-study-plan-items-by-week";
import { studyPlanStatusLabels } from "#/modules/timeline/presentation/timeline-labels";
import { WeeklyTimeline } from "#/modules/timeline/presentation/weekly-timeline";
import { Badge } from "#/shared/presentation/ui/badge";
import { Button } from "#/shared/presentation/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/presentation/ui/card";

const goalStatusLabels: Record<LearningGoal["status"], string> = {
  active: "Active",
  completed: "Completed",
  paused: "Paused",
};

type GoalTimelinePageProps = {
  goal: LearningGoal;
  plan: StudyPlan | null;
  weeks: TimelineWeek[];
};

export function GoalTimelinePage({ goal, plan, weeks }: GoalTimelinePageProps) {
  return (
    <div className="pb-16">
      <header className="rise-in mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 w-fit">
          <Link to="/goals">Back to goals</Link>
        </Button>
        <p className="island-kicker mb-2">Study timeline</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{goalStatusLabels[goal.status]}</Badge>
          <Badge
            variant="secondary"
            className="island-kicker rounded-full border-[var(--primary-border)]"
          >
            {goal.hoursPerWeek} h/week
          </Badge>
        </div>
        <h1 className="display-title mt-3 text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
          {goal.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
          Your weekly study plan for this goal, based on linked resources and your available hours.
        </p>
      </header>

      {!plan ? (
        <Card className="island-shell rounded-2xl border-[var(--border-default)] py-8 shadow-none">
          <CardHeader>
            <CardTitle className="display-title text-xl">No study plan yet</CardTitle>
            <CardDescription>
              Generate a plan from your linked resources to see a week-by-week schedule.
            </CardDescription>
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
                <Badge variant="outline">{studyPlanStatusLabels[plan.status]}</Badge>
                <Badge variant="secondary">{plan.estimatedWeeks} weeks</Badge>
                <Badge variant="secondary">{plan.totalEstimatedHours}h total</Badge>
              </div>
              <CardTitle className="display-title text-xl font-bold text-[var(--text-primary)]">
                {plan.title}
              </CardTitle>
              <CardDescription>
                Generated {new Date(plan.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
          </Card>

          <WeeklyTimeline weeks={weeks} />
        </>
      )}
    </div>
  );
}
