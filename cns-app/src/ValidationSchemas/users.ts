import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email().min(3, "Email is required"),
  role: z.string().min(3, "Role is required.").max(10),
  name: z.string().min(3, "Name is required").max(255),
  password: z
    .string()
    .min(6, "Password must at least be 6 characters")
    .max(255)
    .optional()
    .or(z.literal("")),
});

export const socialSchema = z.object({
  platform: z.enum([
    "twitter",
    "instagram",
    "facebook",
    "tiktok",
    "deviantart",
    "reddit",
    "youtube",
    "discord",
    "github",
    "website",
    "other",
  ]),
  label: z.string().optional(),
  url: z.string().url("Please enter a valid URL"),
});

export const userProfileSchema = z.object({
  displayName: z.string().min(3, "Name must be at least 3 characters"),
  profileCatch: z.string().max(511).optional(),
  profileDescription: z.string().max(65535).optional(),
  thumbnail: z.string().optional(),
  banner: z.string().optional(),
  socials: z.array(socialSchema).default([]),
  userId: z.string().min(1, "User ID is required"),
});

export const updateUserSettingsSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().min(3, "Email must be at least 3 characters"),
});

export const updateUserSchema = updateUserSettingsSchema.extend({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(1, "Role is required"),
});

export const signInFormSchema = z.object({
  email: z.string().email(`invalid email address`),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(6, "Name must be at least 3 characters long"),
    email: z.string().email(`invalid email address`),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords dont match",
    path: ["confirmPassword"],
  });
