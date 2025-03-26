import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../prisma/db";
import { ChildMapSchema } from "@/ValidationSchemas/maps";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = ChildMapSchema.safeParse(body);

    if (!validation.success) {
      console.log("Validation failed:", validation.error.format());
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const newChildMap = await prisma.mapHierarchyChild.create({
      data: {
        x: validation.data.x || 0,
        y: validation.data.y || 0,
        wx: validation.data.wx || 0,
        wy: validation.data.wy || 0,
        childMap: {
          connect: {
            id: validation.data.childMapId,
          },
        },
        hierarchy: {
          connect: {
            id: validation.data.hierarchyId,
          },
        },
      },
    });

    return NextResponse.json(newChildMap, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
