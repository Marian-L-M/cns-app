import { GlobalAreasSchema } from "@/ValidationSchemas/global";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/db";
import { MapAreaType } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const validation = GlobalAreasSchema.safeParse(body);

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

    const newGlobalArea = await prisma.globalArea.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        imageUrl: validation.data.imageUrl,
        objectTime: validation.data.objectTime,
        type: validation.data.type as MapAreaType,
        nodes: validation.data.nodes || null,
        styles: validation.data.styles || null,
        infobox: validation.data.infobox || null,
        map: {
          connect: {
            id: validation.data.mapId,
          },
        },
        wiki: {
          connect: {
            id: validation.data.wikiId,
          },
        },
      },
    });

    return NextResponse.json(newGlobalArea, { status: 201 });
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
