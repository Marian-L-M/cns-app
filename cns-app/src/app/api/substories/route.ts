import { SubStorySchema } from "@/ValidationSchemas/stories";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = SubStorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const newSubstory = await prisma.subStory.create({
      data: { ...body },
    });
    return NextResponse.json(newSubstory, { status: 201 });
  } catch (error) {
    console.error("Error creating substory:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
