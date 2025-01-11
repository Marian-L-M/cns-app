import { GlobalObjectsSchema } from "@/ValidationSchemas/global";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const validation = GlobalObjectsSchema.safeParse(body);

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

    const newGlobalObject = await prisma.globalObject.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        imageUrl: validation.data.imageUrl || "",
        thumbUrl: validation.data.thumbUrl || "",
        x: validation.data.x || 0,
        y: validation.data.y || 0,
        objectTime: validation.data.objectTime || 0,
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

    return NextResponse.json(newGlobalObject, { status: 201 });
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
