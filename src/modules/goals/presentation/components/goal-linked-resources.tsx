import { Link } from "@tanstack/react-router";

import type { GoalLinkedResource } from "#/modules/goals/domain/entities/goal-linked-resource";

type GoalLinkedResourcesProps = {
  resources: GoalLinkedResource[];
};

export function GoalLinkedResources({ resources }: GoalLinkedResourcesProps) {
  if (resources.length === 0) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">No resources linked to this goal yet.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {resources.map((resource) => (
        <li key={resource.resourceId}>
          <Link
            to="/resources/$id"
            params={{ id: resource.resourceId }}
            className="text-sm font-medium text-[var(--text-primary)] underline-offset-4 hover:underline"
          >
            {resource.title}
          </Link>
          <span className="ml-2 text-xs text-[var(--text-secondary)]">
            {resource.category} · {resource.level}
          </span>
        </li>
      ))}
    </ul>
  );
}
