import { z } from "zod";

export const mapSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
  imageUrl: z.string().min(1, "image url").max(255).optional(),
  mapUrl: z.string().min(1, "Map image is required").max(255).optional(),
  mapScale: z.number().min(0, "Map Zoom Level").max(10).optional(),
  mapTime: z.number().min(0, "Story time on Map").max(9999).optional(),
});

export const ChildMapSchema = z.object({
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
