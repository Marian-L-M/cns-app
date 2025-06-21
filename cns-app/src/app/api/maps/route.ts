import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { mapSchema } from "@/ValidationSchemas/maps";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = mapSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    // Map author ids back to user objects
    const { authors, ...fields } = body;
    const updateData: any = { ...fields };

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

    const newMap = await prisma.map.create({
      data: { ...updateData },
    });
    return NextResponse.json(newMap, { status: 201 });
  } catch (error) {
    console.error("Error creating map", error);
    return NextResponse.json(
      { error: "Internal Server Eroor" },
      { status: 500 }
    );
  }
}
