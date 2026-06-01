import type { GoalLinkedResource } from "#/modules/goals/domain/entities/goal-linked-resource";
import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type {
  DashboardProgressSummary,
  DashboardResourcePreview,
  UserDashboard,
} from "#/modules/dashboard/domain/entities/user-dashboard";
import type { PersonalLibraryItem } from "#/modules/library/domain/entities/personal-library-item";

const NEXT_RESOURCES_LIMIT = 6;

export type ComputeUserDashboardInput = {
  goals: LearningGoal[];
  libraryItems: PersonalLibraryItem[];
  linkedResources: GoalLinkedResource[];
};

export function computeUserDashboard(input: ComputeUserDashboardInput): UserDashboard {
  const focusGoal = pickFocusGoal(input.goals);
  const progress = computeProgress(input.libraryItems);
  const pendingHoursEstimate = computePendingHours(input.libraryItems);
  const nextResources = buildNextResources(
    input.libraryItems,
    focusGoal?.id ?? null,
    input.linkedResources,
  );

  return {
    focusGoal,
    progress,
    pendingHoursEstimate,
    nextResources,
    isEmpty: input.goals.length === 0 && input.libraryItems.length === 0,
  };
}

function pickFocusGoal(goals: LearningGoal[]): LearningGoal | null {
  if (goals.length === 0) {
    return null;
  }

  const activeGoal = goals.find((goal) => goal.status === "active");
  return activeGoal ?? goals[0] ?? null;
}

function computeProgress(items: PersonalLibraryItem[]): DashboardProgressSummary {
  const pending = items.filter((item) => item.status === "pending").length;
  const inProgress = items.filter((item) => item.status === "in_progress").length;
  const completed = items.filter((item) => item.status === "completed").length;
  const discarded = items.filter((item) => item.status === "discarded").length;
  const totalSaved = items.length;
  const overallProgressPercent = totalSaved === 0 ? 0 : Math.round((completed / totalSaved) * 100);

  return {
    totalSaved,
    pending,
    inProgress,
    completed,
    discarded,
    overallProgressPercent,
  };
}

function computePendingHours(items: PersonalLibraryItem[]): number {
  const sum = items
    .filter((item) => item.status === "pending" || item.status === "in_progress")
    .reduce((total, item) => {
      const remaining = item.estimatedHours * (1 - item.progressPercentage / 100);
      return total + remaining;
    }, 0);

  return Math.round(sum * 10) / 10;
}

function buildNextResources(
  libraryItems: PersonalLibraryItem[],
  focusGoalId: string | null,
  linkedResources: GoalLinkedResource[],
): DashboardResourcePreview[] {
  const libraryByResourceId = new Map(libraryItems.map((item) => [item.resourceId, item]));
  const seen = new Set<string>();
  const result: DashboardResourcePreview[] = [];

  const addItem = (item: PersonalLibraryItem | undefined) => {
    if (!item || seen.has(item.resourceId)) {
      return;
    }
    if (item.status === "completed" || item.status === "discarded") {
      return;
    }

    seen.add(item.resourceId);
    result.push(toPreview(item));
  };

  for (const item of libraryItems) {
    if (item.status === "in_progress") {
      addItem(item);
    }
    if (result.length >= NEXT_RESOURCES_LIMIT) {
      return result;
    }
  }

  if (focusGoalId) {
    const linkedForGoal = linkedResources
      .filter((resource) => resource.goalId === focusGoalId)
      .sort((left, right) => left.priority - right.priority);

    for (const linked of linkedForGoal) {
      addItem(libraryByResourceId.get(linked.resourceId));
      if (result.length >= NEXT_RESOURCES_LIMIT) {
        return result;
      }
    }
  }

  for (const item of libraryItems) {
    if (item.status === "pending") {
      addItem(item);
    }
    if (result.length >= NEXT_RESOURCES_LIMIT) {
      return result;
    }
  }

  return result;
}

function toPreview(item: PersonalLibraryItem): DashboardResourcePreview {
  return {
    resourceId: item.resourceId,
    title: item.title,
    status: item.status,
    progressPercentage: item.progressPercentage,
    estimatedHours: item.estimatedHours,
    category: item.category,
    level: item.level,
  };
}
