import { StoriesSchema } from "@/ValidationSchemas/stories";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { generateUniqueSlug } from "@/lib/slug";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const story = await prisma.story.findUnique({
      where: { id: id },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json(story, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
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

  // Regenerate slug from title
  const slug = await generateUniqueSlug(story.title, prisma, "story", story.id);

  // Map author ids back to user objects
  const { authors, ...fields } = body;
  const updateData: any = { ...fields, slug };

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
