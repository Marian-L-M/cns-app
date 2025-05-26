import { z } from "zod";

export const GlobalObjectsSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
  imageUrl: z.string().min(1, "image url").max(255).optional(),
  thumbUrl: z.string().min(1, "thumbnail url").max(255).optional(),
  x: z.number().min(0, "Global X").max(1000).optional(),
  y: z.number().min(0, "Global Y").max(1000).optional(),
  objectTime: z.number().min(0, "Object time").max(9999).optional(),
  styles: z.any().nullable().optional(),
  type: z.string().min(1, "object type").max(255).optional(),
  infobox: z.any().nullable().optional(),
  mapId: z.number().int().positive("Map ID is required"),
  wikiId: z.number().int().positive().optional(),
});

// export const GlobalAreasSchema = z.object({
//   title: z.string().min(1, "Title is required").max(255),
//   description: z.string().min(1, "Description is required").max(65535),
//   imageUrl: z.string().min(1, "image url").max(255).optional(),
//   objectTime: z.number().min(0, "Object time").max(9999).optional(),
//   type: z.string().min(1, "object type").max(255).optional(),
// });
export const MapAreaType = z.enum(["GEOGRAPHY", "POLITICAL", "OTHER"]);

export const GlobalAreasSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string(),
  mapId: z.number().int().positive("Map ID is required"),
  wikiId: z.number().int().positive().optional(),
  nodes: z.any().nullable().optional(),
  styles: z.any().nullable().optional(),
  objectTime: z.number().int(),
  type: MapAreaType.default("GEOGRAPHY"),
  infobox: z.any().nullable().optional(),
});
