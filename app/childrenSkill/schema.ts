import { z } from "zod";

export const ChidrentSkillSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters long",
  }),
  translationsname: z.string().min(3, {
    message: "Translation Name must be at least 3 characters long",
  }),
  subskillid: z.string(),
});

export type ChidrentSkillSchemaType = z.infer<typeof ChidrentSkillSchema>;

export const EditChidrentSkillSchema = z.object({
  id: z.string(),
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters long",
  }),
  translationsname: z.string().min(3, {
    message: "Translation Name must be at least 3 characters long",
  }),
  subskillid: z.string(),
});

export type EditChidrentSkillSchemaType = z.infer<
  typeof EditChidrentSkillSchema
>;
