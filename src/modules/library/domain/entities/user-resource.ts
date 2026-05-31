export const USER_RESOURCE_STATUSES = ["pending", "in_progress", "completed", "discarded"] as const;

export type UserResourceStatus = (typeof USER_RESOURCE_STATUSES)[number];

export type SavedUserResource = {
  id: string;
  userId: string;
  resourceId: string;
  status: UserResourceStatus;
  progressPercentage: number;
  notes: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
