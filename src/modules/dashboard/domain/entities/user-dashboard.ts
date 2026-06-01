import type { LearningGoal } from "#/modules/goals/domain/entities/goal";
import type { UserResourceStatus } from "#/modules/library/domain/entities/user-resource";

export type DashboardProgressSummary = {
  totalSaved: number;
  pending: number;
  inProgress: number;
  completed: number;
  discarded: number;
  overallProgressPercent: number;
};

export type DashboardResourcePreview = {
  resourceId: string;
  title: string;
  status: UserResourceStatus;
  progressPercentage: number;
  estimatedHours: number;
  category: string;
  level: string;
};

export type UserDashboard = {
  focusGoal: LearningGoal | null;
  progress: DashboardProgressSummary;
  pendingHoursEstimate: number;
  nextResources: DashboardResourcePreview[];
  isEmpty: boolean;
};
