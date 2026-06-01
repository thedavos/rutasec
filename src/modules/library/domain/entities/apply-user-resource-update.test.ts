import { describe, expect, it } from "vite-plus/test";

import { applyUserResourceUpdate } from "#/modules/library/domain/entities/apply-user-resource-update";
import type { SavedUserResource } from "#/modules/library/domain/entities/user-resource";

const base: SavedUserResource = {
  id: "ur-1",
  userId: "app-1",
  resourceId: "res-1",
  status: "pending",
  progressPercentage: 0,
  notes: null,
  startedAt: null,
  completedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const now = "2026-06-01T12:00:00.000Z";

describe("applyUserResourceUpdate", () => {
  it("sets started_at when moving to in_progress", () => {
    expect(
      applyUserResourceUpdate(base, { status: "in_progress", progressPercentage: 25 }, now),
    ).toEqual({
      status: "in_progress",
      progressPercentage: 25,
      startedAt: now,
      completedAt: null,
    });
  });

  it("preserves started_at when already set and moving to in_progress", () => {
    const current = { ...base, startedAt: "2026-05-01T00:00:00.000Z" };

    expect(
      applyUserResourceUpdate(current, { status: "in_progress", progressPercentage: 50 }, now),
    ).toEqual({
      status: "in_progress",
      progressPercentage: 50,
      startedAt: "2026-05-01T00:00:00.000Z",
      completedAt: null,
    });
  });

  it("sets completed_at and forces progress to 100 when completed", () => {
    expect(
      applyUserResourceUpdate(base, { status: "completed", progressPercentage: 40 }, now),
    ).toEqual({
      status: "completed",
      progressPercentage: 100,
      startedAt: now,
      completedAt: now,
    });
  });

  it("clears dates when moving to pending", () => {
    const current = {
      ...base,
      status: "in_progress" as const,
      startedAt: "2026-05-01T00:00:00.000Z",
      completedAt: null,
      progressPercentage: 30,
    };

    expect(
      applyUserResourceUpdate(current, { status: "pending", progressPercentage: 0 }, now),
    ).toEqual({
      status: "pending",
      progressPercentage: 0,
      startedAt: null,
      completedAt: null,
    });
  });

  it("clears completed_at but keeps started_at when discarded", () => {
    const current = {
      ...base,
      status: "completed" as const,
      startedAt: "2026-05-01T00:00:00.000Z",
      completedAt: "2026-05-15T00:00:00.000Z",
      progressPercentage: 100,
    };

    expect(
      applyUserResourceUpdate(current, { status: "discarded", progressPercentage: 100 }, now),
    ).toEqual({
      status: "discarded",
      progressPercentage: 100,
      startedAt: "2026-05-01T00:00:00.000Z",
      completedAt: null,
    });
  });

  it("does not mutate timestamps on progress-only updates", () => {
    const current = {
      ...base,
      status: "in_progress" as const,
      startedAt: "2026-05-01T00:00:00.000Z",
      progressPercentage: 20,
    };

    expect(
      applyUserResourceUpdate(current, { status: "in_progress", progressPercentage: 75 }, now),
    ).toEqual({
      status: "in_progress",
      progressPercentage: 75,
      startedAt: "2026-05-01T00:00:00.000Z",
      completedAt: null,
    });
  });
});
