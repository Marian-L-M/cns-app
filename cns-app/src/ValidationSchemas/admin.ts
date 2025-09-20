import { AdminSettingsType } from "@prisma/client";
import { z } from "zod";

export const AdminSettingsSchema = z.object({
  category: z.nativeEnum(AdminSettingsType).default("OTHER"),
  subCategory: z.string().max(255).optional(),
  type: z.string().max(255),
  value: z.string(),
  order: z.number().int(),
});
