import { z } from "zod";

export const StoriesSchema = z.object({
  id: z.number().int().optional(),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
  bannerUrl: z.string().optional(),
  imageUrl: z.string().min(1, "image url").max(255).optional(),
  category: z.string().min(1, "category").max(255).optional(),
  tags: z.array(z.string().max(128)).optional(),
  rating: z.number().min(0, "Rating").max(5).optional(),
  storyTime: z.number().min(0, "Story time").max(9999).optional(),
  status: z.string().min(1, "Status").max(10).optional(),
  assignedToMapID: z.number().int().optional(),
  featured: z.boolean().default(false),
});

export const SubstoryNodeType = z.enum(["SQUARE", "CIRCLE", "DIAMOND", "ICON"]);

export const NodeItemSchema = z.object({
  id: z.number().int().positive("Valid Id is required"),
  x: z.number().min(0, "Global X").max(1000),
  y: z.number().min(0, "Global Y").max(1000),
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().min(1, "Description is required"),
  timeStart: z
    .number()
    .min(0, "Time start in object time")
    .max(9999)
    .optional(),
  timeEnd: z.number().min(0, "time end in object time").max(9999).optional(),
  iconType: SubstoryNodeType.default("SQUARE"),
  iconUrl: z.string().optional(),
  iconColor: z.string().max(255).optional(),
  iconSize: z.number().max(100).optional(),
  label: z.boolean().default(false),
  labelColor: z.string().max(255).optional(),
  fontColor: z.string().max(255).optional(),
});

export const SubStorySchema = z.object({
  id: z.number().int().optional(),
  title: z.string().min(1, "Title is required").max(255),
  nodes: z.array(NodeItemSchema),
  description: z.string().min(1, "Description is required").max(65535),
  objectTime: z.number().min(0, "Object time").max(9999).optional(),
  storyId: z.number().int().positive("Story ID is required"),
});
