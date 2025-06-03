import { z } from "zod";

export const barItemSchema = z.object({
  id: z.string().min(1, "Id is required").max(255),
  key: z.string().min(1, "Key is required").max(255),
  value: z.string().min(1, "Content is required").max(255),
});

export const infoBoxItemSchema = z.object({
  id: z.string().min(1, "Id is required").max(255),
  type: z.enum(["image", "collection", "text"]),
  title: z.string().max(255),
  url: z.string().max(255).optional(),
  caption: z.string().max(255).optional(),
  bars: z.array(barItemSchema).optional(),
  content: z.string().max(255).optional(),
});

export const wikiSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
  wikiText: z.string().min(1, "Please write a meaningful article").max(65535),
  infobox: z.array(infoBoxItemSchema).optional(),
  thumbUrl: z.string().optional(),
  category: z.string().min(1, "Cateogry is required").max(255),
  tags: z.array(z.string().max(128)).optional(),
  featured: z.boolean().default(false),
  authors: z.array(z.string()),
});
