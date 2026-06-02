export type StudyPlanStatus = "active" | "archived";
export type StudyPlanGeneratedBy = "system" | "user";
export type StudyPlanItemStatus = "pending" | "in_progress" | "completed";

export type StudyPlanItem = {
  id: string;
  studyPlanId: string;
  resourceId: string;
  itemOrder: number;
  weekNumber: number;
  status: StudyPlanItemStatus;
  estimatedStartDate: string | null;
  estimatedEndDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StudyPlan = {
  id: string;
  userId: string;
  goalId: string;
  title: string;
  totalEstimatedHours: number;
  estimatedWeeks: number;
  status: StudyPlanStatus;
  generatedBy: StudyPlanGeneratedBy;
  createdAt: string;
  updatedAt: string;
  items: StudyPlanItem[];
};
