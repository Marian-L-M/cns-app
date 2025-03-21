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

    const newMasterMap = await prisma.mapHierarchyMaster.create({
      data: { ...body },
    });
    return NextResponse.json(newMasterMap, { status: 201 });
  } catch (error) {
    console.error("Error creating map", error);
    return NextResponse.json(
      { error: "Internal Server Eroor" },
      { status: 500 }
    );
  }
}
