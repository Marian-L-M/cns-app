import { z } from "zod";

export const mapSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
  imageUrl: z.string().min(1, "Display image is required"),
  mapUrl: z.string().min(1, "Map image is required"),
  mapWidth: z.number().min(100, "Image too small"),
  mapHeight: z.number().min(100, "Image too small"),
  canvasAspectRatio: z
    .number()
    .min(0.1, "Max vertical is 1-10")
    .max(10, "Max horizontal is 10-1"),
  mapTime: z.number().min(0, "Story time on Map").max(9999).optional(),
  category: z.string().min(1, "Cateogry is required").max(255),
  tags: z.array(z.string().max(128)).optional(),
  featured: z.boolean().default(false),
});

export const ChildMapSchema = z.object({
  hierarchyId: z.number().int().positive("Parent hierarchy is required"),
  childMapId: z.number().int().positive("Child map ID is required"),
  x: z.number().min(0, "Global X").max(1000).optional(),
  y: z.number().min(0, "Global Y").max(1000).optional(),
  wx: z.number().min(0, "Global Map Width").max(1000).optional(),
  wy: z.number().min(0, "Global Map Height").max(1000).optional(),
});

export const MasterMapSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  parentMapId: z.number().int().positive("Parent map is required"),
  childMaps: z.array(ChildMapSchema).optional(),
});
