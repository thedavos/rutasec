import type { UserResourceStatus } from "#/modules/library/domain/entities/user-resource";

export type PersonalLibraryItem = {
  userResourceId: string;
  resourceId: string;
  status: UserResourceStatus;
  progressPercentage: number;
  savedAt: string;
  title: string;
  category: string;
  level: string;
  resourceType: string;
  estimatedHours: number;
};

export type PersonalLibrary = {
  items: PersonalLibraryItem[];
  statusFilter: UserResourceStatus | null;
};
