import { describe, expect, it } from "vite-plus/test";

import { mapResourceRowToCard } from "#/modules/catalog/adapters/mappers/map-resource-row";

describe("mapResourceRowToCard", () => {
  it("maps snake_case rows to card shape for public UI", () => {
    expect(
      mapResourceRowToCard({
        id: "res-1",
        title: "Linux Journey",
        description: "Learn Linux",
        url: "https://linuxjourney.com/",
        phase: "Foundational Knowledge Phase",
        category: "Operating Systems",
        topic: "Linux Basics",
        subtopic: "Linux Fundamentals",
        resource_type: "course",
        level: "beginner",
        estimated_hours: 6,
        is_free: 1,
        language: "en",
        original_source_name: "Linux Journey",
        curated_from_name: "Cybersecurity-Mastery-Roadmap",
      }),
    ).toEqual({
      id: "res-1",
      title: "Linux Journey",
      description: "Learn Linux",
      url: "https://linuxjourney.com/",
      phase: "Foundational Knowledge Phase",
      category: "Operating Systems",
      topic: "Linux Basics",
      subtopic: "Linux Fundamentals",
      resourceType: "course",
      level: "beginner",
      estimatedHours: 6,
      isFree: true,
      language: "en",
      attribution: {
        originalSourceName: "Linux Journey",
        curatedFromName: "Cybersecurity-Mastery-Roadmap",
      },
    });
  });

  it("maps paid resources when is_free is not 1", () => {
    expect(
      mapResourceRowToCard({
        id: "res-2",
        title: "Paid Course",
        description: null,
        url: "https://example.com/",
        phase: "Phase",
        category: "Networking",
        topic: "Topic",
        subtopic: null,
        resource_type: "course",
        level: "advanced",
        estimated_hours: 10,
        is_free: 0,
        language: null,
        original_source_name: "Source",
        curated_from_name: "Roadmap",
      }).isFree,
    ).toBe(false);
  });
});
