import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { MasterMapSchema } from "@/ValidationSchemas/maps";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = MasterMapSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const { authors, title, parentMapId } = body;
    const updateData: any = { title, parentMapId };

    // Handle authors field if it exists
    if (authors !== undefined) {
      if (Array.isArray(authors)) {
        updateData.authors = {
          connect: authors.map((authorId: string) => ({
            id: authorId,
          })),
        };
      }
    }

    // Circumvent child maps validation
    const newMasterMap = await prisma.mapHierarchyMaster.create({
      data: {
        ...updateData,
      },
    });

    return NextResponse.json(newMasterMap, { status: 201 });
  } catch (error) {
    console.error("Error creating map", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
