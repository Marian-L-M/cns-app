import { StoriesSchema } from "@/ValidationSchemas/stories";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = StoriesSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const newStory = await prisma.story.create({
      data: { ...body },
    });
    return NextResponse.json(newStory, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
