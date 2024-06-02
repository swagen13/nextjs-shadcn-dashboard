import { z } from "zod";

export const UserSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters long",
  }),
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  image: z.any().optional(),
});

export const EditUserSchema = z.object({
  id: z.string(),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters long",
  }),
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  image: z.any().optional(),
});

export type EditUserSchemaType = z.infer<typeof EditUserSchema>;

export type UserSchemaType = z.infer<typeof UserSchema>;
