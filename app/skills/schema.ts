import { z } from "zod";

export const SkillSchema = z.object({
  id: z.string().uuid().optional(), // UUID as a string, optional if not provided
  name: z.string().min(1, {
    message: "Name is required",
  }),
  color: z.string().max(50).optional(), // Optional field
  description: z.string().optional(), // Optional field
  icon: z.string().optional(), // Optional field
  parent_id: z.string(), // UUID as a string or null
  sequence: z.number().int().optional(), // Optional integer field
  slug: z.string().optional(), // Optional field
  skill_image: z.string().optional(), // Optional field for skill image
  translations: z
    .array(
      z.object({
        locale: z.string(),
        name: z.string(),
      })
    )
    .optional(), // Optional array of translations
  created_at: z.string().optional(), // Timestamp field
  updated_at: z.string().optional(), // Timestamp field
});

export type SkillSchemaType = z.infer<typeof SkillSchema>;

export const EditSkillSchema = z.object({
  id: z.string().uuid().optional(), // UUID as a string, optional if not provided
  name: z.string().min(1, {
    message: "Name is required",
  }),
  color: z.string().max(50).optional(), // Optional field
  description: z.string().optional(), // Optional field
  icon: z.string().optional(), // Optional field
  parent_id: z.string(), // UUID as a string or null
  sequence: z.number().int().optional(), // Optional integer field
  slug: z.string().optional(), // Optional field
  skill_image: z.string().optional(), // Optional field for skill image
  translations: z
    .array(
      z.object({
        locale: z.string(),
        name: z.string(),
      })
    )
    .optional(), // Optional array of translations
  created_at: z.string().optional(), // Timestamp field
  updated_at: z.string().optional(), // Timestamp field
});

export type EditSkillSchemaType = z.infer<typeof EditSkillSchema>;

export interface SkillData {
  id: string | null;
  name: string;
  color: string | null;
  description: string | null;
  icon: string | null;
  parent_id: string | null;
  sequence: string | null;
  slug: string;
  translations: { locale: string; name: string }[];
  level?: number; // Optional, if it might not always be present
  skill_image?: string | null; // Optional field for skill image
  [key: string]: any; // Allow other properties to exist
}
