import { z } from "zod";

export const GlobalObjectsSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
  imageUrl: z.string().min(1, "image url").max(255).optional(),
  thumbUrl: z.string().min(1, "thumbnail url").max(255).optional(),
  x: z.number().min(0, "Global X").max(1000).optional(),
  y: z.number().min(0, "Global Y").max(1000).optional(),
  objectTime: z.number().min(0, "Object time").max(9999).optional(),
  type: z.string().min(1, "object type").max(255).optional(),
});

export const GlobalAreasSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
  imageUrl: z.string().min(1, "image url").max(255).optional(),
  objectTime: z.number().min(0, "Object time").max(9999).optional(),
  type: z.string().min(1, "object type").max(255).optional(),
});
