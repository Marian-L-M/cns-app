import { GlobalObjectsSchema } from "@/ValidationSchemas/global";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { MapObjectType } from "@prisma/client";

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
    const data: any = {
      title: validation.data.title,
      description: validation.data.description,
      thumbUrl: validation.data.thumbUrl || "",
      iconUrl: validation.data.iconUrl || "",
      x: validation.data.x || 0,
      y: validation.data.y || 0,
      objectTime: validation.data.objectTime || 0,
      type: validation.data.type as MapObjectType,
      map: {
        connect: {
          id: validation.data.mapId,
        },
      },
    };

    // Connect wiki optionally
    if (validation.data.wikiId) {
      data.wiki = {
        connect: {
          id: validation.data.wikiId,
        },
      };
    }

    const newGlobalObject = await prisma.globalObject.create({
      data: data,
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
