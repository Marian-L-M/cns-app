import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/db";
import { MasterMapSchema } from "@/ValidationSchemas/maps";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = MasterMapSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const { title, parentMapId } = body;

    // Circumvent child maps validation
    const newMasterMap = await prisma.mapHierarchyMaster.create({
      data: {
        title,
        parentMapId,
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
