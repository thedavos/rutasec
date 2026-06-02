import { Link } from "@tanstack/react-router";

import type { GoalLinkedResource } from "#/modules/goals/domain/entities/goal-linked-resource";
import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import { AddGoalResourceSelect } from "#/modules/goals/presentation/components/add-goal-resource-select";
import { GoalLinkedResources } from "#/modules/goals/presentation/components/goal-linked-resources";
import type { PersonalLibraryItem } from "#/modules/library/domain/entities/personal-library-item";
import { Badge } from "#/shared/presentation/ui/badge";
import { Button } from "#/shared/presentation/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/presentation/ui/card";
import { cn } from "#/shared/utils";

const statusLabels: Record<LearningGoal["status"], string> = {
  active: "Active",
  completed: "Completed",
  paused: "Paused",
};

type GoalCardProps = {
  goal: LearningGoal;
  linkedResources: GoalLinkedResource[];
  libraryItems: PersonalLibraryItem[];
};

export function GoalCard({ goal, linkedResources, libraryItems }: GoalCardProps) {
  const linkedResourceIds = new Set(linkedResources.map((resource) => resource.resourceId));
  return (
    <Card className={cn("feature-card island-shell h-full gap-0 rounded-2xl py-0 shadow-none")}>
      <CardHeader className="gap-3 px-5 pt-5 pb-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{statusLabels[goal.status]}</Badge>
          <Badge
            variant="secondary"
            className="island-kicker rounded-full border-[var(--chip-line)]"
          >
            {goal.hoursPerWeek} h/week
          </Badge>
        </div>
        <CardTitle className="display-title text-xl font-bold leading-tight text-[var(--sea-ink)]">
          {goal.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 pt-2 pb-5">
        {goal.description ? (
          <CardDescription className="mb-2 line-clamp-3 text-sm text-[var(--sea-ink-soft)]">
            {goal.description}
          </CardDescription>
        ) : null}
        <CardDescription className="text-sm text-[var(--sea-ink-soft)]">
          {goal.targetDate
            ? `Target ${new Date(`${goal.targetDate}T00:00:00`).toLocaleDateString()}`
            : "No target date"}
          {" · "}
          Created {new Date(goal.createdAt).toLocaleDateString()}
        </CardDescription>

        <div className="mt-4 border-t border-[var(--line)] pt-4">
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
            <Link to="/goals/$goalId/timeline" params={{ goalId: goal.id }}>
              View study timeline
            </Link>
          </Button>
        </div>

        <div className="mt-4 space-y-3 border-t border-[var(--line)] pt-4">
          <h3 className="text-sm font-semibold text-[var(--sea-ink)]">Linked resources</h3>
          <GoalLinkedResources resources={linkedResources} />
          <AddGoalResourceSelect
            goalId={goal.id}
            libraryItems={libraryItems}
            linkedResourceIds={linkedResourceIds}
          />
        </div>
      </CardContent>
    </Card>
  );
}
