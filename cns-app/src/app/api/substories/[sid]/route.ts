import { storyObjectsSchema } from "@/ValidationSchemas/stories";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";

interface Props {
  params: { sid: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = storyObjectsSchema.safeParse(body);
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.sid);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const substory = await prisma.subStory.findUnique({
    where: { id: id },
  });

  if (!substory) {
    return NextResponse.json({ error: "Substory not found" }, { status: 404 });
  }

  const updateSubstory = await prisma.subStory.update({
    where: { id: substory.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateSubstory, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.sid);

  const substory = await prisma.subStory.findUnique({
    where: { id: id },
  });

  if (!substory) {
    return NextResponse.json({ error: "Substory not found" }, { status: 404 });
  }

  await prisma.subStory.delete({
    where: { id: substory.id },
  });

  return NextResponse.json({ message: "Substory deleted" }, { status: 200 });
}
