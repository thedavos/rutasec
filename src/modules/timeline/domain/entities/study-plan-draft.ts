import type { ResourceLevel } from "#/modules/catalog/domain/entities/resource";
import type { UserResourceStatus } from "#/modules/library/domain/entities/user-resource";

export type StudyPlanItemStatus = "pending" | "in_progress" | "completed";

export type TimelineResourceInput = {
  resourceId: string;
  title: string;
  level: ResourceLevel;
  estimatedHours: number;
  priority: number;
  libraryStatus?: UserResourceStatus;
  progressPercentage?: number;
};

export type TimelinePlanningInput = {
  goalId: string;
  hoursPerWeek: number;
  resources: TimelineResourceInput[];
};

export type StudyPlanItemDraft = {
  resourceId: string;
  title: string;
  itemOrder: number;
  weekNumber: number;
  remainingHours: number;
  status: StudyPlanItemStatus;
};

export type StudyPlanDraft = {
  goalId: string;
  totalEstimatedHours: number;
  estimatedWeeks: number;
  items: StudyPlanItemDraft[];
};
