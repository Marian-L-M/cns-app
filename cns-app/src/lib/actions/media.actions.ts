"use server";
import { requireAuthorOrAdmin } from "@/lib/auth-guards";
import prisma from "@/../prisma/db";

export async function getMediaItems() {
  const session = await requireAuthorOrAdmin();

  if (session.user.role === "ADMIN") {
    return await prisma.mediaItem.findMany();
  } else {
    return await prisma.mediaItem.findMany({
      where: {
        uploadedById: session.user.id,
      },
    });
  }
}
