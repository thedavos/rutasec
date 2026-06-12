import { z } from "zod";

import { RESOURCE_LEVELS, RESOURCE_TYPES } from "#/modules/catalog/domain/entities/resource";

export const resourceRowSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  icon_url: z.string().nullable(),
  phase: z.string(),
  category: z.string(),
  topic: z.string(),
  subtopic: z.string().nullable(),
  resource_type: z.enum(RESOURCE_TYPES),
  level: z.enum(RESOURCE_LEVELS),
  estimated_hours: z.number(),
  is_free: z.number(),
  language: z.string().nullable(),
  original_source_name: z.string(),
  original_source_url: z.string(),
  curated_from_name: z.string(),
  curated_from_url: z.string(),
});

export type ResourceRow = z.infer<typeof resourceRowSchema>;

export const resourceRowListSchema = z.array(resourceRowSchema);

export const resourceDetailRowSchema = resourceRowSchema.extend({
  roadmap_section: z.string().nullable(),
  path_id: z.string().nullable(),
  path_slug: z.string().nullable(),
  path_title: z.string().nullable(),
  item_order: z.number().nullable(),
  path_total: z.number().nullable(),
});

export type ResourceDetailRow = z.infer<typeof resourceDetailRowSchema>;
