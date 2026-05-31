import type { UserResourceStatus } from "#/modules/library/domain/entities/user-resource";

export const statusLabels: Record<UserResourceStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  discarded: "Discarded",
};

export const typeLabels: Record<string, string> = {
  course: "Course",
  book: "Book",
  documentation: "Docs",
  video: "Video",
  lab: "Lab",
  tool: "Tool",
  article: "Article",
};
