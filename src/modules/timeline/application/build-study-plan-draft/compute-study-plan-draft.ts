import type { ResourceLevel } from "#/modules/catalog/domain/entities/resource";
import type {
  StudyPlanDraft,
  StudyPlanItemDraft,
  StudyPlanItemStatus,
  TimelinePlanningInput,
  TimelineResourceInput,
} from "#/modules/timeline/domain/entities/study-plan-draft";
import {
  invalidHoursPerWeekError,
  type TimelineError,
} from "#/modules/timeline/domain/errors/timeline-errors";
import { err, ok, type Result } from "#/shared/domain/result";

const LEVEL_RANK: Record<ResourceLevel, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

type ScheduledResource = {
  resourceId: string;
  title: string;
  level: ResourceLevel;
  estimatedHours: number;
  priority: number;
  remainingHours: number;
  status: StudyPlanItemStatus;
};

export function computeStudyPlanDraft(
  input: TimelinePlanningInput,
): Result<StudyPlanDraft, TimelineError> {
  if (!Number.isFinite(input.hoursPerWeek) || input.hoursPerWeek <= 0) {
    return err(invalidHoursPerWeekError());
  }

  const scheduled = input.resources
    .map(toScheduledResource)
    .filter((resource): resource is ScheduledResource => resource !== null)
    .sort(compareScheduledResources);
  const items = packIntoWeeks(scheduled, input.hoursPerWeek);

  return ok({
    goalId: input.goalId,
    totalEstimatedHours: roundToOneDecimal(
      items.reduce((total, item) => total + item.remainingHours, 0),
    ),
    estimatedWeeks: items.at(-1)?.weekNumber ?? 0,
    items,
  });
}

function toScheduledResource(resource: TimelineResourceInput): ScheduledResource | null {
  if (resource.libraryStatus === "completed" || resource.libraryStatus === "discarded") {
    return null;
  }

  const remainingHours = computeRemainingHours(resource);
  if (remainingHours <= 0) {
    return null;
  }

  return {
    resourceId: resource.resourceId,
    title: resource.title,
    level: resource.level,
    estimatedHours: resource.estimatedHours,
    priority: resource.priority,
    remainingHours,
    status: resource.libraryStatus === "in_progress" ? "in_progress" : "pending",
  };
}

function computeRemainingHours(resource: TimelineResourceInput): number {
  if (resource.libraryStatus === "in_progress") {
    const progress = resource.progressPercentage ?? 0;
    return roundToOneDecimal(resource.estimatedHours * (1 - progress / 100));
  }

  return resource.estimatedHours;
}

function compareScheduledResources(left: ScheduledResource, right: ScheduledResource): number {
  return (
    left.priority - right.priority ||
    LEVEL_RANK[left.level] - LEVEL_RANK[right.level] ||
    left.estimatedHours - right.estimatedHours ||
    left.resourceId.localeCompare(right.resourceId)
  );
}

function packIntoWeeks(resources: ScheduledResource[], hoursPerWeek: number): StudyPlanItemDraft[] {
  const items: StudyPlanItemDraft[] = [];
  let weekNumber = 1;
  let weekUsedHours = 0;

  for (const resource of resources) {
    if (weekUsedHours > 0 && weekUsedHours + resource.remainingHours > hoursPerWeek) {
      weekNumber += 1;
      weekUsedHours = 0;
    }

    items.push({
      resourceId: resource.resourceId,
      title: resource.title,
      itemOrder: items.length + 1,
      weekNumber,
      remainingHours: resource.remainingHours,
      status: resource.status,
    });

    if (resource.remainingHours > hoursPerWeek) {
      weekNumber += 1;
      weekUsedHours = 0;
    } else {
      weekUsedHours += resource.remainingHours;
    }
  }

  return items;
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}
