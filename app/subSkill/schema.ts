import { z } from "zod";

export const SubSkillSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters long",
  }),
  translationName: z.string().min(3, {
    message: "Translation Name must be at least 3 characters long",
  }),
  parentSkill: z.string(),
});

export type SubSkillSchemaType = z.infer<typeof SubSkillSchema>;

export const EditSubSkillSchema = z.object({
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
  parentSkill: z.string(),
});

export type EditSubSkillSchemaType = z.infer<typeof EditSubSkillSchema>;
