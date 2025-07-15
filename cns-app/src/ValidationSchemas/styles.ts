import { z } from "zod";
import { CanvasStyleItemType } from "@/lib/constants/styles";

export const CanvasStylesSchema = z.object({
  type: z.nativeEnum(CanvasStyleItemType).default("fillStyle"),
  value: z.string().max(255).optional(),
});
