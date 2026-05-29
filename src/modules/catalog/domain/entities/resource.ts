export const RESOURCE_LEVELS = ["beginner", "intermediate", "advanced"] as const;

export const RESOURCE_TYPES = [
  "course",
  "book",
  "documentation",
  "video",
  "lab",
  "tool",
  "article",
] as const;

export type ResourceLevel = (typeof RESOURCE_LEVELS)[number];
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export type CatalogFilters = {
  category?: string;
  level?: ResourceLevel;
  resourceType?: ResourceType;
};

export type CatalogListInput = CatalogFilters;

export type CatalogResourceCard = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  phase: string;
  category: string;
  topic: string;
  subtopic: string | null;
  resourceType: ResourceType;
  level: ResourceLevel;
  estimatedHours: number;
  isFree: boolean;
  language: string | null;
  attribution: {
    originalSourceName: string;
    curatedFromName: string;
  };
};

export type CatalogFilterOptions = {
  categories: string[];
  levels: ResourceLevel[];
  resourceTypes: ResourceType[];
};

export type PublicCatalogResult = {
  resources: CatalogResourceCard[];
  total: number;
  filters: CatalogFilters;
  filterOptions: CatalogFilterOptions;
};
