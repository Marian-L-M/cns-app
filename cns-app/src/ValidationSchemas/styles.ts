import { CanvasStyleItemType } from "@prisma/client";
import { z } from "zod";

export const CanvasStylesSchema = z.object({
  type: z.nativeEnum(CanvasStyleItemType).default("fillStyle"),
  value: z.string().max(255).optional(),
});
