import { z } from "zod";

export const SkillSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters long",
  }),
  translationName: z.string().min(3, {
    message: "Translation Name must be at least 3 characters long",
  }),
});

export type SkillSchemaType = z.infer<typeof SkillSchema>;

export const EditSkillSchema = z.object({
  id: z.string(),
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters long",
  }),
  translationName: z.string().min(3, {
    message: "Translation Name must be at least 3 characters long",
  }),
});

export type EditSkillSchemaType = z.infer<typeof EditSkillSchema>;
