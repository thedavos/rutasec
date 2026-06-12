import { z } from "zod";

export const seedResourceSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    url: z.string().url(),
    phase: z.string().min(1),
    category: z.string().min(1),
    topic: z.string().min(1),
    subtopic: z.string().min(1),
    resource_type: z.enum(["course", "book", "documentation", "video", "lab", "tool", "article"]),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    estimated_hours: z.number().nonnegative(),
    original_source_name: z.string().min(1),
    original_source_url: z.string().url(),
    curated_from_name: z.string().min(1),
    curated_from_url: z.string().url(),
    roadmap_section: z.string().min(1),
    is_free: z.boolean(),
    language: z.enum(["en", "es"]),
    tags: z.array(z.string()).min(1),
    path_order: z.number().int().positive(),
    icon_url: z.string().url().nullable().optional(),
  })
  .superRefine((resource, ctx) => {
    const learningModes = ["theory", "practice", "mixed"];
    const hasLearningMode = resource.tags.some((tag) =>
      learningModes.includes(String(tag).trim().toLowerCase()),
    );

    if (!hasLearningMode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `tags must include one of: ${learningModes.join(", ")}`,
        path: ["tags"],
      });
    }
  });

export type SeedResource = z.infer<typeof seedResourceSchema>;
