import { RESOURCE_LEVELS, type ResourceLevel } from "#/modules/catalog/domain/entities/resource";
import type { GoalLinkedResource } from "#/modules/goals/domain/entities/goal-linked-resource";
import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type { PersonalLibraryItem } from "#/modules/library/domain/entities/personal-library-item";
import type {
  TimelinePlanningInput,
  TimelineResourceInput,
} from "#/modules/timeline/domain/entities/study-plan-draft";
import type { StudyPlanError } from "#/modules/timeline/domain/errors/study-plan-errors";
import { err, ok, type Result } from "#/shared/domain/result";

function parseResourceLevel(level: string): ResourceLevel | null {
  return RESOURCE_LEVELS.includes(level as ResourceLevel) ? (level as ResourceLevel) : null;
}

export function buildTimelinePlanningInput(
  goal: LearningGoal,
  linkedResources: GoalLinkedResource[],
  libraryItems: PersonalLibraryItem[],
): Result<TimelinePlanningInput, StudyPlanError> {
  const libraryByResourceId = new Map(libraryItems.map((item) => [item.resourceId, item]));
  const resources: TimelineResourceInput[] = [];

  for (const linked of linkedResources) {
    if (linked.goalId !== goal.id) {
      continue;
    }

    const parsedLevel = parseResourceLevel(linked.level);
    if (!parsedLevel) {
      return err({
        type: "invalid_resource_level",
        message: `Invalid resource level "${linked.level}" for resource ${linked.resourceId}.`,
      });
    }

    const libraryItem = libraryByResourceId.get(linked.resourceId);
    resources.push({
      resourceId: linked.resourceId,
      title: linked.title,
      level: parsedLevel,
      estimatedHours: linked.estimatedHours,
      priority: linked.priority,
      libraryStatus: libraryItem?.status,
      progressPercentage: libraryItem?.progressPercentage,
    });
  }

  return ok({
    goalId: goal.id,
    hoursPerWeek: goal.hoursPerWeek,
    resources,
  });
}
