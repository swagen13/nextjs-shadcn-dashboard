import { z } from "zod";

export const PostSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  header: z.string().min(3, {
    message: "Header must be at least 3 characters long",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters long",
  }),
  skill: z.string().min(3, {
    message: "Skill must be at least 3 characters long",
  }),
  owner: z.string().min(3, {
    message: "Owner must be at least 3 characters long",
  }),
  wages: z.string().min(3, {
    message: "Wages must be at least 3 characters long",
  }),
  worker: z.string().min(3, {
    message: "Worker must be at least 3 characters long",
  }),
});

export type PostSchemaType = z.infer<typeof PostSchema>;

export const EditPostSchema = z.object({
  id: z.string(),
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  header: z.string().min(3, {
    message: "Header must be at least 3 characters long",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters long",
  }),
  skill: z.string().min(3, {
    message: "Skill must be at least 3 characters long",
  }),
  owner: z.string().min(3, {
    message: "Owner must be at least 3 characters long",
  }),
  wages: z.string().min(3, {
    message: "Wages must be at least 3 characters long",
  }),
  worker: z.string().min(3, {
    message: "Worker must be at least 3 characters long",
  }),
});

export type EditPostSchemaType = z.infer<typeof EditPostSchema>;
