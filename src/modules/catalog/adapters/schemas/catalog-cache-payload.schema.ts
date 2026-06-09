import { z } from "zod";

import { RESOURCE_LEVELS, RESOURCE_TYPES } from "#/modules/catalog/domain/entities/resource";

const catalogResourceCardAttributionSchema = z.object({
  originalSourceName: z.string(),
  originalSourceUrl: z.string(),
  curatedFromName: z.string(),
  curatedFromUrl: z.string(),
});

export const catalogResourceCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  phase: z.string(),
  category: z.string(),
  topic: z.string(),
  subtopic: z.string().nullable(),
  resourceType: z.enum(RESOURCE_TYPES),
  level: z.enum(RESOURCE_LEVELS),
  estimatedHours: z.number(),
  isFree: z.boolean(),
  language: z.string().nullable(),
  attribution: catalogResourceCardAttributionSchema,
});

export const catalogResourceCardListSchema = z.array(catalogResourceCardSchema);

export const catalogFilterOptionsSchema = z.object({
  categories: z.array(z.string()),
  levels: z.array(z.enum(RESOURCE_LEVELS)),
  resourceTypes: z.array(z.enum(RESOURCE_TYPES)),
});

const catalogResourcePathContextSchema = z.object({
  pathId: z.string(),
  pathSlug: z.string(),
  pathTitle: z.string(),
  itemOrder: z.number(),
  totalItems: z.number(),
});

export const catalogResourceDetailSchema = catalogResourceCardSchema
  .omit({ attribution: true })
  .extend({
    roadmapSection: z.string().nullable(),
    attribution: catalogResourceCardAttributionSchema,
    tags: z.array(z.string()),
    pathContext: catalogResourcePathContextSchema.nullable(),
  });
