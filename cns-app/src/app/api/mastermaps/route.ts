import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { MasterMapSchema } from "@/ValidationSchemas/maps";
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
    const validation = MasterMapSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const slug = await generateUniqueSlug(
      validation.data.title,
      prisma,
      "mapHierarchyMaster"
    );

    // Create maphierachymaster and user junction for owner
    const result = await prisma.$transaction(async (tx) => {
      const newMasterMap = await tx.mapHierarchyMaster.create({
        data: { ...body, slug },
      });

      await tx.userMapHierarchy.create({
        data: {
          userId: currentUserId,
          mapHierarchyId: newMasterMap.id,
          role: "OWNER",
        },
      });

      //
      return await tx.mapHierarchyMaster.findUnique({
        where: { id: newMasterMap.id },
        include: {
          userMapHierarchies: {
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
  } catch (error) {
    console.error("Error creating map", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
