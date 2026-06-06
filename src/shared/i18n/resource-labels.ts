import type { UserResourceStatus } from "#/modules/library/domain/entities/user-resource";
import type {
  StudyPlanItemStatus,
  StudyPlanStatus,
} from "#/modules/timeline/domain/entities/study-plan";
import * as m from "#/paraglide/messages.js";

export function levelLabel(level: string) {
  switch (level) {
    case "beginner":
      return m.level_beginner();
    case "intermediate":
      return m.level_intermediate();
    case "advanced":
      return m.level_advanced();
    default:
      return level;
  }
}

export function resourceTypeLabel(type: string) {
  switch (type) {
    case "course":
      return m.type_course();
    case "book":
      return m.type_book();
    case "documentation":
      return m.type_documentation();
    case "video":
      return m.type_video();
    case "lab":
      return m.type_lab();
    case "tool":
      return m.type_tool();
    case "article":
      return m.type_article();
    default:
      return type;
  }
}

export function userResourceStatusLabel(status: UserResourceStatus) {
  switch (status) {
    case "pending":
      return m.status_pending();
    case "in_progress":
      return m.status_in_progress();
    case "completed":
      return m.status_completed();
    case "discarded":
      return m.status_discarded();
  }
}

export function goalStatusLabel(status: "active" | "completed" | "paused") {
  switch (status) {
    case "active":
      return m.goal_status_active();
    case "completed":
      return m.goal_status_completed();
    case "paused":
      return m.goal_status_paused();
  }
}

export function studyPlanStatusLabel(status: StudyPlanStatus) {
  switch (status) {
    case "active":
      return m.study_plan_status_active();
    case "archived":
      return m.study_plan_status_archived();
  }
}

export function studyPlanItemStatusLabel(status: StudyPlanItemStatus) {
  switch (status) {
    case "pending":
      return m.study_plan_item_pending();
    case "in_progress":
      return m.study_plan_item_in_progress();
    case "completed":
      return m.study_plan_item_completed();
  }
}

export function formatResourceCount(count: number) {
  return count === 1
    ? m.catalog_resource_count_one({ count: String(count) })
    : m.catalog_resource_count_other({ count: String(count) });
}

export function formatLibrarySavedCount(count: number) {
  return count === 1
    ? m.library_saved_count_one({ count: String(count) })
    : m.library_saved_count_other({ count: String(count) });
}

export function formatWeekResourceCount(count: number) {
  return count === 1
    ? m.timeline_week_resource_count_one({ count: String(count) })
    : m.timeline_week_resource_count_other({ count: String(count) });
}
