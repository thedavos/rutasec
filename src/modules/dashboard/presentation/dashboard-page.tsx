import { Link } from "@tanstack/react-router";

import type { UserDashboard } from "#/modules/dashboard/domain/entities/user-dashboard";
import { DashboardPageHeader } from "#/modules/dashboard/presentation/dashboard-page-header";
import { statusLabels } from "#/modules/library/presentation/library-labels";
import { Badge } from "#/shared/presentation/ui/badge";
import { Button } from "#/shared/presentation/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/presentation/ui/card";

const goalStatusLabels = {
  active: "Active",
  completed: "Completed",
  paused: "Paused",
} as const;

type DashboardPageProps = {
  dashboard: UserDashboard;
};

export function DashboardPage({ dashboard }: DashboardPageProps) {
  if (dashboard.isEmpty) {
    return (
      <div className="pb-16">
        <DashboardPageHeader>
          <p className="island-kicker mb-2">Your dashboard</p>
          <h1 className="display-title text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
            Learning overview
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            Save resources from the catalog and set a learning goal to see your progress here.
          </p>
        </DashboardPageHeader>

        <Card className="island-shell mt-8 rounded-2xl border-[var(--border-default)] py-8 shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="display-title text-xl">Nothing to summarize yet</CardTitle>
            <CardDescription>
              Browse the catalog to save resources, then create a goal to track what you want to
              learn.
            </CardDescription>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/">Browse catalog</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/goals">Create a goal</Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <DashboardPageHeader>
        <p className="island-kicker mb-2">Your dashboard</p>
        <h1 className="display-title text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
          Learning overview
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
          A snapshot of your active goal, library progress, and what to work on next.
        </p>
      </DashboardPageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        {dashboard.focusGoal ? (
          <Card className="island-shell rounded-2xl border-[var(--border-default)] shadow-none">
            <CardHeader>
              <p className="island-kicker mb-1">Focus goal</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{goalStatusLabels[dashboard.focusGoal.status]}</Badge>
                <Badge
                  variant="secondary"
                  className="island-kicker rounded-full border-[var(--primary-border)]"
                >
                  {dashboard.focusGoal.hoursPerWeek} h/week
                </Badge>
              </div>
              <CardTitle className="display-title text-2xl font-bold text-[var(--text-primary)]">
                {dashboard.focusGoal.title}
              </CardTitle>
              <CardDescription>
                {dashboard.focusGoal.targetDate
                  ? `Target ${new Date(`${dashboard.focusGoal.targetDate}T00:00:00`).toLocaleDateString()}`
                  : "No target date"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/goals/$goalId/timeline" params={{ goalId: dashboard.focusGoal.id }}>
                  View study timeline
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/goals">View all goals</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="island-shell rounded-2xl border-[var(--border-default)] shadow-none">
            <CardHeader>
              <CardTitle className="display-title text-xl">No learning goal yet</CardTitle>
              <CardDescription>
                Create a goal to focus your weekly study time and link resources.
              </CardDescription>
              <Button asChild className="mt-2 w-fit">
                <Link to="/goals">Create a goal</Link>
              </Button>
            </CardHeader>
          </Card>
        )}

        <Card className="island-shell rounded-2xl border-[var(--border-default)] shadow-none">
          <CardHeader>
            <p className="island-kicker mb-1">Pending effort</p>
            <CardTitle className="display-title text-3xl font-bold text-[var(--text-primary)]">
              {dashboard.pendingHoursEstimate}h
            </CardTitle>
            <CardDescription>
              Estimated remaining hours across pending and in-progress resources.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <section className="mt-10" aria-labelledby="progress-summary-heading">
        <h2
          id="progress-summary-heading"
          className="display-title mb-4 text-2xl font-bold text-[var(--text-primary)]"
        >
          Library progress
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ProgressStat label="Saved" value={dashboard.progress.totalSaved} />
          <ProgressStat label="Pending" value={dashboard.progress.pending} />
          <ProgressStat label="In progress" value={dashboard.progress.inProgress} />
          <ProgressStat label="Completed" value={dashboard.progress.completed} />
          <ProgressStat
            label="Completion"
            value={`${dashboard.progress.overallProgressPercent}%`}
          />
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="next-resources-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2
            id="next-resources-heading"
            className="display-title text-2xl font-bold text-[var(--text-primary)]"
          >
            Next up
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/library">View library</Link>
          </Button>
        </div>

        {dashboard.nextResources.length === 0 ? (
          <Card className="island-shell rounded-2xl border-[var(--border-default)] py-6 shadow-none">
            <CardHeader>
              <CardTitle className="display-title text-lg">No active resources</CardTitle>
              <CardDescription>
                Save resources from the catalog or mark saved items as in progress.
              </CardDescription>
              <Button asChild className="mt-2 w-fit">
                <Link to="/">Browse catalog</Link>
              </Button>
            </CardHeader>
          </Card>
        ) : (
          <ul className="grid gap-4">
            {dashboard.nextResources.map((resource) => (
              <li key={resource.resourceId}>
                <Card className="island-shell rounded-2xl border-[var(--border-default)] shadow-none">
                  <CardHeader className="gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{statusLabels[resource.status]}</Badge>
                      <Badge variant="secondary">{resource.estimatedHours}h</Badge>
                      <Badge variant="outline" className="capitalize">
                        {resource.level}
                      </Badge>
                    </div>
                    <CardTitle className="display-title text-lg font-bold">
                      <Link
                        to="/resources/$id"
                        params={{ id: resource.resourceId }}
                        className="text-[var(--text-primary)] no-underline hover:text-[var(--primary-hover)]"
                      >
                        {resource.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {resource.category}
                      {resource.progressPercentage > 0
                        ? ` · ${resource.progressPercentage}% complete`
                        : null}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ProgressStat({ label, value }: { label: string; value: number | string }) {
  return (
    <li>
      <Card className="island-shell rounded-2xl border-[var(--border-default)] shadow-none">
        <CardHeader className="gap-1">
          <CardDescription>{label}</CardDescription>
          <CardTitle className="display-title text-2xl font-bold text-[var(--text-primary)]">
            {value}
          </CardTitle>
        </CardHeader>
      </Card>
    </li>
  );
}
