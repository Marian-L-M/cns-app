import { z } from "zod";

export const storiesSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
  imageUrl: z.string().min(1, "image url").max(255).optional(),
  category: z.string().min(1, "category").max(255).optional(),
  rating: z.number().min(0, "Rating").max(5).optional(),
  storyTime: z.number().min(0, "Story time").max(9999).optional(),
  status: z.string().min(1, "Status").max(10).optional(),
});

export const storyObjectsSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
  objectTime: z.number().min(0, "Object time").max(9999).optional(),
});
