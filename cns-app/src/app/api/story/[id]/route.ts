import { StoriesSchema } from "@/ValidationSchemas/stories";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = StoriesSchema.safeParse(body);
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const story = await prisma.story.findUnique({
    where: { id: id },
  });

  if (!story) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  // Map author ids back to user objects
  const { authors, ...fields } = body;
  const updateData: any = { ...fields };

  // Handle authors field if it exists
  if (authors !== undefined) {
    if (Array.isArray(authors)) {
      updateData.authors = {
        set: authors.map((authorId: string) => ({
          id: authorId,
        })),
      };
    }
  }

  try {
    const updateStory = await prisma.story.update({
      where: { id: story.id },
      data: updateData,
    });

    return NextResponse.json(updateStory, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update Story" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const story = await prisma.story.findUnique({
    where: { id: id },
  });

  if (!story) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  await prisma.story.delete({
    where: { id: story.id },
  });

  return NextResponse.json({ message: "Story deleted" }, { status: 200 });
}
