import type { GoalLinkedResource } from "#/modules/goals/domain/entities/goal-linked-resource";

export function groupGoalLinkedResourcesByGoalId(
  linked: GoalLinkedResource[],
): Map<string, GoalLinkedResource[]> {
  const grouped = new Map<string, GoalLinkedResource[]>();

  for (const resource of linked) {
    const existing = grouped.get(resource.goalId);
    if (existing) {
      existing.push(resource);
    } else {
      grouped.set(resource.goalId, [resource]);
    }
  }

  return grouped;
}
