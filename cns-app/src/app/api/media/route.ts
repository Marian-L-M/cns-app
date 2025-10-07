// app/api/media/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const created = await prisma.mediaItem.create({
      data: {
        ...data,
        uploadedById: session.user.id,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error("Media save error:", error);
    return NextResponse.json(
      { error: "Failed to save media item" },
      { status: 500 }
    );
  }
}
