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

  const updateStory = await prisma.story.update({
    where: { id: story.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateStory, { status: 200 });
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
