import { z } from "zod";

export const storiesSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
  imageUrl: z.string().min(1, "image url").max(255).optional(),
  category: z.string().min(1, "category").max(255).optional(),
  rating: z.number().min(0, "Rating").max(5).optional(),
  storyTime: z.number().min(0, "Story time").max(9999).optional(),
  status: z.string().min(1, "Status").max(10).optional(),
});

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
});

export const storyObjectsSchema = z.object({
  id: z.number().int().positive("Valid Id is required"),
  title: z.string().min(1, "Title is required").max(255),
  nodes: z.array(NodeItemSchema),
  description: z.string().min(1, "Description is required").max(65535),
  objectTime: z.number().min(0, "Object time").max(9999).optional(),
  entryId: z.number().int().positive("Story (Entry) ID is required"),
});
