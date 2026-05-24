import { defineCollection, z } from "astro:content";

const projectSchema = z.object({
  title: z.string(),
  tagline: z.string(),
  status: z.enum(["NOW", "PILOT", "FUTURE"]),
  layer: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  icon: z.string().optional(),
  architecture: z.array(z.string()),
  highlights: z.array(z.string()).optional(),
  businessModel: z.string().optional(),
  complianceStrata: z.string().optional(),
  demoUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().optional(),
  permissionLevel: z
    .enum(["PUBLIC", "PROFESSIONAL", "OFFICE", "SUPERVISOR", "BACKEND"])
    .optional(),
  draft: z.boolean().default(false),
  order: z.number().default(99),
});

const projects = defineCollection({
  type: "content",
  schema: projectSchema,
});

const internal = defineCollection({
  type: "content",
  schema: projectSchema,
});

export const collections = { projects, internal };
