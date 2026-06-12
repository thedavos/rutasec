import { describe, expect, it } from "vite-plus/test";

import { mapResourceDetailRow } from "#/modules/catalog/adapters/mappers/map-resource-detail-row";

const baseRow = {
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
  curated_from_name: "Cybersecurity-Mastery-Roadmap",
  original_source_url: "https://linuxjourney.com/",
  curated_from_url: "https://github.com/Hamed233/Cybersecurity-Mastery-Roadmap",
  roadmap_section: "Foundational Knowledge Phase > Operating Systems",
  path_id: "path-1",
  path_slug: "web-pentesting-bug-bounty-starter",
  path_title: "Web Pentesting Starter Path",
  item_order: 1,
  path_total: 18,
};

describe("mapResourceDetailRow", () => {
  it("maps snake_case detail rows with path context and attribution urls", () => {
    expect(mapResourceDetailRow(baseRow)).toEqual({
      id: "res-1",
      title: "Linux Journey",
      description: "Learn Linux",
      url: "https://linuxjourney.com/",
      iconUrl: "https://icons.duckduckgo.com/ip3/linuxjourney.com.ico",
      phase: "Foundational Knowledge Phase",
      category: "Operating Systems",
      topic: "Linux Basics",
      subtopic: "Linux Fundamentals",
      resourceType: "course",
      level: "beginner",
      estimatedHours: 6,
      isFree: true,
      language: "en",
      roadmapSection: "Foundational Knowledge Phase > Operating Systems",
      attribution: {
        originalSourceName: "Linux Journey",
        originalSourceUrl: "https://linuxjourney.com/",
        curatedFromName: "Cybersecurity-Mastery-Roadmap",
        curatedFromUrl: "https://github.com/Hamed233/Cybersecurity-Mastery-Roadmap",
      },
      tags: [],
      pathContext: {
        pathId: "path-1",
        pathSlug: "web-pentesting-bug-bounty-starter",
        pathTitle: "Web Pentesting Starter Path",
        itemOrder: 1,
        totalItems: 18,
      },
    });
  });

  it("returns null pathContext when path fields are incomplete", () => {
    expect(
      mapResourceDetailRow({
        ...baseRow,
        path_id: null,
        path_slug: null,
        path_title: null,
        item_order: null,
        path_total: null,
      }).pathContext,
    ).toBeNull();
  });
});
