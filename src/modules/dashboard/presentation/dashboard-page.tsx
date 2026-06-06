import { Link } from "@tanstack/react-router";

import type { UserDashboard } from "#/modules/dashboard/domain/entities/user-dashboard";
import { DashboardPageHeader } from "#/modules/dashboard/presentation/dashboard-page-header";
import * as m from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";
import {
  goalStatusLabel,
  levelLabel,
  userResourceStatusLabel,
} from "#/shared/i18n/resource-labels";
import { Badge } from "#/shared/presentation/ui/badge";
import { Button } from "#/shared/presentation/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/presentation/ui/card";

type DashboardPageProps = {
  dashboard: UserDashboard;
};

export function DashboardPage({ dashboard }: DashboardPageProps) {
  const locale = getLocale();

  if (dashboard.isEmpty) {
    return (
      <div className="pb-16">
        <DashboardPageHeader>
          <p className="island-kicker mb-2">{m.dashboard_kicker()}</p>
          <h1 className="display-title text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
            {m.dashboard_title()}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            {m.dashboard_empty_description()}
          </p>
        </DashboardPageHeader>

        <Card className="island-shell mt-8 rounded-2xl border-[var(--border-default)] py-8 shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="display-title text-xl">
              {m.dashboard_empty_card_title()}
            </CardTitle>
            <CardDescription>{m.dashboard_empty_card_description()}</CardDescription>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/">{m.action_browse_catalog()}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/goals">{m.dashboard_create_goal()}</Link>
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
        <p className="island-kicker mb-2">{m.dashboard_kicker()}</p>
        <h1 className="display-title text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
          {m.dashboard_title()}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
          {m.dashboard_populated_description()}
        </p>
      </DashboardPageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        {dashboard.focusGoal ? (
          <Card className="island-shell rounded-2xl border-[var(--border-default)] shadow-none">
            <CardHeader>
              <p className="island-kicker mb-1">{m.dashboard_focus_goal()}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{goalStatusLabel(dashboard.focusGoal.status)}</Badge>
                <Badge
                  variant="secondary"
                  className="island-kicker rounded-full border-[var(--primary-border)]"
                >
                  {m.goal_hours_per_week({ hours: String(dashboard.focusGoal.hoursPerWeek) })}
                </Badge>
              </div>
              <CardTitle className="display-title text-2xl font-bold text-[var(--text-primary)]">
                {dashboard.focusGoal.title}
              </CardTitle>
              <CardDescription>
                {dashboard.focusGoal.targetDate
                  ? m.goal_target_date({
                      date: new Date(
                        `${dashboard.focusGoal.targetDate}T00:00:00`,
                      ).toLocaleDateString(locale),
                    })
                  : m.goal_no_target_date()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/goals/$goalId/timeline" params={{ goalId: dashboard.focusGoal.id }}>
                  {m.goal_view_timeline()}
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/goals">{m.dashboard_view_all_goals()}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="island-shell rounded-2xl border-[var(--border-default)] shadow-none">
            <CardHeader>
              <CardTitle className="display-title text-xl">{m.dashboard_no_goal_title()}</CardTitle>
              <CardDescription>{m.dashboard_no_goal_description()}</CardDescription>
              <Button asChild className="mt-2 w-fit">
                <Link to="/goals">{m.dashboard_create_goal()}</Link>
              </Button>
            </CardHeader>
          </Card>
        )}

        <Card className="island-shell rounded-2xl border-[var(--border-default)] shadow-none">
          <CardHeader>
            <p className="island-kicker mb-1">{m.dashboard_pending_effort()}</p>
            <CardTitle className="display-title text-3xl font-bold text-[var(--text-primary)]">
              {m.dashboard_pending_hours({ hours: String(dashboard.pendingHoursEstimate) })}
            </CardTitle>
            <CardDescription>{m.dashboard_pending_description()}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <section className="mt-10" aria-labelledby="progress-summary-heading">
        <h2
          id="progress-summary-heading"
          className="display-title mb-4 text-2xl font-bold text-[var(--text-primary)]"
        >
          {m.dashboard_library_progress()}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ProgressStat label={m.dashboard_stat_saved()} value={dashboard.progress.totalSaved} />
          <ProgressStat label={m.dashboard_stat_pending()} value={dashboard.progress.pending} />
          <ProgressStat
            label={m.dashboard_stat_in_progress()}
            value={dashboard.progress.inProgress}
          />
          <ProgressStat label={m.dashboard_stat_completed()} value={dashboard.progress.completed} />
          <ProgressStat
            label={m.dashboard_stat_completion()}
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
            {m.dashboard_next_up()}
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/library">{m.dashboard_view_library()}</Link>
          </Button>
        </div>

        {dashboard.nextResources.length === 0 ? (
          <Card className="island-shell rounded-2xl border-[var(--border-default)] py-6 shadow-none">
            <CardHeader>
              <CardTitle className="display-title text-lg">
                {m.dashboard_no_active_title()}
              </CardTitle>
              <CardDescription>{m.dashboard_no_active_description()}</CardDescription>
              <Button asChild className="mt-2 w-fit">
                <Link to="/">{m.action_browse_catalog()}</Link>
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
                      <Badge variant="outline">{userResourceStatusLabel(resource.status)}</Badge>
                      <Badge variant="secondary">{resource.estimatedHours}h</Badge>
                      <Badge variant="outline">{levelLabel(resource.level)}</Badge>
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
                        ? m.dashboard_resource_complete({
                            percent: String(resource.progressPercentage),
                          })
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
