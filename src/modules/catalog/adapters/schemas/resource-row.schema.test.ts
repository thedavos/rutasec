import { describe, expect, it } from "vite-plus/test";

import {
  resourceDetailRowSchema,
  resourceRowListSchema,
  resourceRowSchema,
} from "#/modules/catalog/adapters/schemas/resource-row.schema";

const validRow = {
  id: "res-1",
  title: "Linux Journey",
  description: "Learn Linux",
  url: "https://linuxjourney.com/",
  icon_url: "https://icons.duckduckgo.com/ip3/linuxjourney.com.ico",
  phase: "Foundational Knowledge Phase",
  category: "Operating Systems",
  topic: "Linux Basics",
  subtopic: "Linux Fundamentals",
  resource_type: "course" as const,
  level: "beginner" as const,
  estimated_hours: 6,
  is_free: 1,
  language: "en",
  original_source_name: "Linux Journey",
  original_source_url: "https://linuxjourney.com/",
  curated_from_name: "Cybersecurity-Mastery-Roadmap",
  curated_from_url: "https://github.com/Hamed233/Cybersecurity-Mastery-Roadmap",
};

const validDetailRow = {
  ...validRow,
  roadmap_section: "Foundational Knowledge Phase > Operating Systems",
  path_id: "path-1",
  path_slug: "web-pentesting-bug-bounty-starter",
  path_title: "Web Pentesting Starter Path",
  item_order: 1,
  path_total: 18,
};

describe("resourceRowSchema", () => {
  it("accepts a valid published resource row", () => {
    expect(resourceRowSchema.parse(validRow)).toEqual(validRow);
  });

  it("rejects rows with invalid enums", () => {
    expect(resourceRowSchema.safeParse({ ...validRow, resource_type: "podcast" }).success).toBe(
      false,
    );
  });

  it("accepts nullable description, subtopic, language, and icon_url", () => {
    expect(
      resourceRowSchema.parse({
        ...validRow,
        description: null,
        subtopic: null,
        language: null,
        icon_url: null,
      }),
    ).toMatchObject({
      description: null,
      subtopic: null,
      language: null,
      icon_url: null,
    });
  });
});

describe("resourceRowListSchema", () => {
  it("accepts an array of valid rows", () => {
    expect(resourceRowListSchema.parse([validRow])).toHaveLength(1);
  });

  it("rejects arrays containing invalid rows", () => {
    expect(resourceRowListSchema.safeParse([validRow, { id: "bad" }]).success).toBe(false);
  });
});

describe("resourceDetailRowSchema", () => {
  it("accepts a valid detail row with path context", () => {
    expect(resourceDetailRowSchema.parse(validDetailRow)).toEqual(validDetailRow);
  });

  it("accepts nullable path fields", () => {
    expect(
      resourceDetailRowSchema.parse({
        ...validDetailRow,
        path_id: null,
        path_slug: null,
        path_title: null,
        item_order: null,
        path_total: null,
      }),
    ).toMatchObject({
      path_id: null,
      path_slug: null,
      path_title: null,
      item_order: null,
      path_total: null,
    });
  });

  it("rejects rows missing attribution urls", () => {
    expect(
      resourceRowSchema.safeParse({
        ...validRow,
        original_source_url: undefined,
      }).success,
    ).toBe(false);
  });
});
