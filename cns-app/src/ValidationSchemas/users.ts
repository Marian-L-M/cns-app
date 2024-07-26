import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email().min(3, "Email is required"),
  role: z.string().min(3, "Role is required.").max(10),
  name: z.string().min(3, "Name is required").max(255),
  username: z.string().min(3, "Username"),
  image: z.string().min(3, "image url").max(255).optional(),
  password: z
    .string()
    .min(6, "Password must at least be 6 characters")
    .max(255)
    .optional()
    .or(z.literal("")),
});
