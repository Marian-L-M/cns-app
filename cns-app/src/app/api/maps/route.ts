import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { mapSchema } from "@/ValidationSchemas/maps";
import { auth } from "@/auth";
import { generateUniqueSlug } from "@/lib/slug";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    const currentUserId = session.user.id;
    const body = await request.json();
    const validation = mapSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    // Generate slug from title
    const slug = await generateUniqueSlug(validation.data.title, prisma, "map");

    // Create the map and user map for owner
    const result = await prisma.$transaction(async (tx) => {
      const newMap = await tx.map.create({
        data: { ...body, slug },
      });

      await tx.userMap.create({
        data: {
          userId: currentUserId,
          mapId: newMap.id,
          role: "OWNER",
        },
      });

      //
      return await tx.map.findUnique({
        where: { id: newMap.id },
        include: {
          userMaps: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating map", error);

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A story with this data already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Eroor" },
      { status: 500 }
    );
  }
}
