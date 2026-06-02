# Timeline rules

DAV-117 freezes the first study plan scheduling rules for RutaSec. The rules are intentionally small. DAV-118 persists generated plans in D1 (`study_plans`, `study_plan_items`). DAV-119 renders the weekly view at `/goals/$goalId/timeline`.

## Input

Timeline generation starts from a goal and the resources linked to that goal.

```ts
type TimelinePlanningInput = {
  goalId: string;
  hoursPerWeek: number;
  resources: TimelineResourceInput[];
};

type TimelineResourceInput = {
  resourceId: string;
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  priority: number;
  libraryStatus?: "pending" | "in_progress" | "completed" | "discarded";
  progressPercentage?: number;
};
```

`hoursPerWeek` comes from the goal. `priority` comes from `goal_resources`. `level` and `estimatedHours` come from the catalog resource.

## Output

The rule engine returns a draft. `generateStudyPlanForGoalFn` runs the draft through this logic and writes `study_plans` / `study_plan_items` (replacing any existing active plan for the goal).

```ts
type StudyPlanDraft = {
  goalId: string;
  totalEstimatedHours: number;
  estimatedWeeks: number;
  items: StudyPlanItemDraft[];
};

type StudyPlanItemDraft = {
  resourceId: string;
  title: string;
  itemOrder: number;
  weekNumber: number;
  remainingHours: number;
  status: "pending" | "in_progress" | "completed";
};
```

## Eligibility

Completed and discarded resources do not appear in the draft.

| Library state | In plan | Remaining hours                                                           |
| ------------- | ------- | ------------------------------------------------------------------------- |
| Not saved     | Yes     | Full `estimatedHours`                                                     |
| `pending`     | Yes     | Full `estimatedHours`                                                     |
| `in_progress` | Yes     | `estimatedHours * (1 - progressPercentage / 100)`, rounded to one decimal |
| `completed`   | No      | 0                                                                         |
| `discarded`   | No      | 0                                                                         |

If the computed remaining hours are less than or equal to 0, the resource is excluded.

## Ordering

Resources use a stable ascending sort:

1. `priority`, with lower numbers first.
2. `level`, ordered as `beginner`, `intermediate`, then `advanced`.
3. `estimatedHours`, with shorter resources first.
4. `resourceId`, as the deterministic tie-break.

This keeps fundamentals before advanced material without adding path-order or AI recommendations in the first version.

## Week assignment

The planner uses greedy whole-resource packing.

1. Start with week 1.
2. Walk the sorted resources.
3. Add the next resource to the current week when it fits within `hoursPerWeek`.
4. Start a new week when it does not fit.
5. If one resource is larger than `hoursPerWeek`, put it alone in its week.

Resources are not split across weeks in the MVP. `estimatedWeeks` is the number of weeks used by the packed items. `totalEstimatedHours` is the sum of scheduled remaining hours.

## Item status

The draft item status is `in_progress` only when the library status is `in_progress`. Every other scheduled item is `pending`. Completed resources are excluded, so the planner does not emit completed items.

## Edge cases

| Case                                       | Result                                                         |
| ------------------------------------------ | -------------------------------------------------------------- |
| No linked resources                        | Empty items, `estimatedWeeks = 0`, `totalEstimatedHours = 0`   |
| All completed or discarded                 | Same as empty                                                  |
| Completed and pending mixed                | Only pending or in-progress resources are scheduled            |
| Same priority                              | `level`, then `estimatedHours`, then `resourceId` decide order |
| Advanced before beginner in input          | Beginner is scheduled first when priority matches              |
| In progress at 50 percent                  | Half of `estimatedHours` remains                               |
| Resource not in library                    | Full hours and `pending` status                                |
| One 12 hour resource at 5 hours per week   | One item in week 1                                             |
| Three 2 hour resources at 5 hours per week | Two items in week 1, one item in week 2                        |
| Invalid `hoursPerWeek`                     | `InvalidHoursPerWeek` domain error                             |

## Non-scope

The first version does not split a single resource across weeks, reorder by path phase, regenerate plans automatically on library changes, call AI, or support drag and drop.
