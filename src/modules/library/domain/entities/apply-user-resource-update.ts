import type {
  SavedUserResource,
  UserResourceStatus,
} from "#/modules/library/domain/entities/user-resource";

export type UserResourceUpdatePatch = {
  status: UserResourceStatus;
  progressPercentage: number;
};

export type UserResourceUpdateFields = {
  status: UserResourceStatus;
  progressPercentage: number;
  startedAt: string | null;
  completedAt: string | null;
};

export function applyUserResourceUpdate(
  current: SavedUserResource,
  patch: UserResourceUpdatePatch,
  now: string,
): UserResourceUpdateFields {
  let startedAt = current.startedAt;
  let completedAt = current.completedAt;
  let progressPercentage = patch.progressPercentage;

  if (patch.status !== current.status) {
    switch (patch.status) {
      case "in_progress":
        if (!startedAt) {
          startedAt = now;
        }
        break;
      case "completed":
        if (!startedAt) {
          startedAt = now;
        }
        completedAt = now;
        progressPercentage = 100;
        break;
      case "pending":
        startedAt = null;
        completedAt = null;
        break;
      case "discarded":
        completedAt = null;
        break;
    }
  }

  return {
    status: patch.status,
    progressPercentage,
    startedAt,
    completedAt,
  };
}
