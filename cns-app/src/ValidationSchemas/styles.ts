import { z } from "zod";
import { AllStyleItemTypeList } from "@/lib/constants/styles";

export const CanvasStylesSchema = z.object({
  type: z.nativeEnum(AllStyleItemTypeList).default("fillStyle"),
  value: z.string().max(255).optional(),
});
