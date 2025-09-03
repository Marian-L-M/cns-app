import { WikiInfoboxType, WikiType } from "@prisma/client";
import { z } from "zod";

export const barItemSchema = z.object({
  id: z.string().min(1, "Id is required").max(255),
  key: z.string().min(1, "Key is required").max(255),
  value: z.string().min(1, "Content is required").max(255),
});

export const wikiSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
  wikiText: z.string().min(1, "Please write a meaningful article").max(65535),
  thumbUrl: z.string().optional(),
  category: z.string().min(1, "Cateogry is required").max(255),
  tags: z.array(z.string().max(128)).optional(),
  type: z.nativeEnum(WikiType).default("GENERAL"),
  featured: z.boolean().default(false),
});

export const WikiInfoboxItemSchema = z.object({
  order: z.number().int().min(1, "Order must be at least 1"),
  type: z.nativeEnum(WikiInfoboxType).default("TEXT"),
  title: z.string().max(255).default(""),
  description: z.string().default(""),
  imageUrl: z.string().max(2048).default(""),
  caption: z.string().max(255).default(""),
  collections: z.array(z.any()).default([]),
  wikiId: z.number().int().optional(),
});
