import { z } from "zod";

export const MediaItemSchema = z.object({
  filename: z.string().min(1, "File name is required").max(255),
  originalName: z.string().min(1, "No file name set").max(255),
  fileKey: z.string().min(1, "File key is required").max(255),

  mimeType: z.string().min(1, "Mime type is required").max(255),
  fileSize: z.number().min(0, "Invalid file size"),
  width: z.number().min(0, "Invalid file width").optional(),
  height: z.number().min(0, "Invalid file height").optional(),

  provider: z.string().min(1, "Provider required"),
  url: z.string().min(1, "image url required").max(255),
  thumbnailUrl: z.string().max(255).optional(),

  title: z.string().max(255).optional(),
  alt: z.string().max(255).optional(),
  caption: z.string().optional(),
  tags: z.array(z.string().max(128)).optional(),
});
