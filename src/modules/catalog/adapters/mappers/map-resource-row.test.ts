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
        icon_url: "https://icons.duckduckgo.com/ip3/linuxjourney.com.ico",
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
        original_source_url: "https://linuxjourney.com/",
        curated_from_name: "Cybersecurity-Mastery-Roadmap",
        curated_from_url: "https://github.com/Hamed233/Cybersecurity-Mastery-Roadmap",
      }),
    ).toEqual({
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
      attribution: {
        originalSourceName: "Linux Journey",
        originalSourceUrl: "https://linuxjourney.com/",
        curatedFromName: "Cybersecurity-Mastery-Roadmap",
        curatedFromUrl: "https://github.com/Hamed233/Cybersecurity-Mastery-Roadmap",
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
        icon_url: null,
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
        original_source_url: "https://example.com/source",
        curated_from_name: "Roadmap",
        curated_from_url: "https://example.com/roadmap",
      }).isFree,
    ).toBe(false);
  });
});
