import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email().min(3, "Email is required"),
  role: z.string().min(3, "Role is required.").max(10),
  name: z.string().min(3, "Name is required").max(255),
  image: z.string().min(3, "image url").max(255).optional(),
  password: z
    .string()
    .min(6, "Password must at least be 6 characters")
    .max(255)
    .optional()
    .or(z.literal("")),
});

export const signInFormSchema = z.object({
  email: z.string().email(`invalid email address`),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
