export const GOAL_STATUSES = ["active", "completed", "paused"] as const;

export type GoalStatus = (typeof GOAL_STATUSES)[number];

export type LearningGoal = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  targetDate: string | null;
  hoursPerWeek: number;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
};

export type UserGoals = {
  goals: LearningGoal[];
};
