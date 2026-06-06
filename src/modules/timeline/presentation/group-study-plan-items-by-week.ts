import type { StudyPlanItem } from "#/modules/timeline/domain/entities/study-plan";
import * as m from "#/paraglide/messages.js";

export type TimelineWeekItem = StudyPlanItem & {
  title: string;
};

export type TimelineWeek = {
  weekNumber: number;
  items: TimelineWeekItem[];
};

export function groupStudyPlanItemsByWeek(
  items: StudyPlanItem[],
  titleByResourceId: Map<string, string>,
): TimelineWeek[] {
  const byWeek = new Map<number, StudyPlanItem[]>();

  for (const item of items) {
    const weekItems = byWeek.get(item.weekNumber) ?? [];
    weekItems.push(item);
    byWeek.set(item.weekNumber, weekItems);
  }

  return [...byWeek.entries()]
    .sort(([weekA], [weekB]) => weekA - weekB)
    .map(([weekNumber, weekItems]) => ({
      weekNumber,
      items: [...weekItems]
        .sort((itemA, itemB) => itemA.itemOrder - itemB.itemOrder)
        .map((item) => ({
          ...item,
          title: titleByResourceId.get(item.resourceId) ?? m.timeline_unknown_resource(),
        })),
    }));
}
