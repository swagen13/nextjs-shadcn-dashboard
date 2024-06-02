import { z } from "zod";

export const ProfileSchema = z.object({
  displayName: z.string().min(3, {
    message: "Display name must be at least 3 characters long",
  }),
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters long",
  }),
  image: z.any().optional(),
  uid: z.string(),
});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;
