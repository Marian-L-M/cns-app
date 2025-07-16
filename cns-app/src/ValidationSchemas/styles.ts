import { z } from "zod";
import { AllStyleItemType } from "@/lib/constants/styles";

export const CanvasStylesSchema = z.object({
  type: z.nativeEnum(AllStyleItemType).default("fillStyle"),
  value: z.string().max(255).optional(),
});
