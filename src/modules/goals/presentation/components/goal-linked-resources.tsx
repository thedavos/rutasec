import { Link } from "@tanstack/react-router";

import type { GoalLinkedResource } from "#/modules/goals/domain/entities/goal-linked-resource";
import * as m from "#/paraglide/messages.js";
import { levelLabel } from "#/shared/i18n/resource-labels";

type GoalLinkedResourcesProps = {
  resources: GoalLinkedResource[];
};

export function GoalLinkedResources({ resources }: GoalLinkedResourcesProps) {
  if (resources.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)]">{m.goal_no_linked_resources()}</p>;
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
            {resource.category} · {levelLabel(resource.level)}
          </span>
        </li>
      ))}
    </ul>
  );
}
