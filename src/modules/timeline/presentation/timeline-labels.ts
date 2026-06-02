import type {
  StudyPlanItemStatus,
  StudyPlanStatus,
} from "#/modules/timeline/domain/entities/study-plan";

export const studyPlanStatusLabels: Record<StudyPlanStatus, string> = {
  active: "Active",
  archived: "Archived",
};

export const studyPlanItemStatusLabels: Record<StudyPlanItemStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
};
