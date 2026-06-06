import { describe, expect, it } from "vite-plus/test";

import type { StudyPlanItem } from "#/modules/timeline/domain/entities/study-plan";
import { groupStudyPlanItemsByWeek } from "#/modules/timeline/presentation/group-study-plan-items-by-week";
import * as m from "#/paraglide/messages.js";

function makeItem(
  overrides: Partial<StudyPlanItem> & Pick<StudyPlanItem, "resourceId">,
): StudyPlanItem {
  return {
    id: overrides.id ?? `item-${overrides.resourceId}`,
    studyPlanId: overrides.studyPlanId ?? "plan-1",
    resourceId: overrides.resourceId,
    itemOrder: overrides.itemOrder ?? 1,
    weekNumber: overrides.weekNumber ?? 1,
    status: overrides.status ?? "pending",
    estimatedStartDate: overrides.estimatedStartDate ?? null,
    estimatedEndDate: overrides.estimatedEndDate ?? null,
    createdAt: overrides.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: overrides.updatedAt ?? "2026-01-01T00:00:00.000Z",
  };
}

describe("groupStudyPlanItemsByWeek", () => {
  it("returns empty weeks for no items", () => {
    expect(groupStudyPlanItemsByWeek([], new Map())).toEqual([]);
  });

  it("groups items by week and sorts by item order", () => {
    const titles = new Map([
      ["r1", "First"],
      ["r2", "Second"],
      ["r3", "Third"],
    ]);

    const result = groupStudyPlanItemsByWeek(
      [
        makeItem({ resourceId: "r3", itemOrder: 3, weekNumber: 2 }),
        makeItem({ resourceId: "r2", itemOrder: 2, weekNumber: 1 }),
        makeItem({ resourceId: "r1", itemOrder: 1, weekNumber: 1 }),
      ],
      titles,
    );

    expect(result).toEqual([
      {
        weekNumber: 1,
        items: [
          expect.objectContaining({ resourceId: "r1", title: "First", itemOrder: 1 }),
          expect.objectContaining({ resourceId: "r2", title: "Second", itemOrder: 2 }),
        ],
      },
      {
        weekNumber: 2,
        items: [expect.objectContaining({ resourceId: "r3", title: "Third", itemOrder: 3 })],
      },
    ]);
  });

  it("falls back to unknown title when resource is missing from the map", () => {
    const result = groupStudyPlanItemsByWeek([makeItem({ resourceId: "missing" })], new Map());

    expect(result[0]?.items[0]?.title).toBe(m.timeline_unknown_resource());
  });
});
