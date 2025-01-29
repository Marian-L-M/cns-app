import { storyObjectsSchema } from "@/ValidationSchemas/stories";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/db";

interface Props {
  params: { sid: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = storyObjectsSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const substory = await prisma.story.findUnique({
    where: { id: parseInt(params.sid) },
  });

  if (!substory) {
    return NextResponse.json({ error: "Substory not found" }, { status: 404 });
  }

  const updateSubstory = await prisma.story.update({
    where: { id: substory.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateSubstory, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const substory = await prisma.story.findUnique({
    where: { id: parseInt(params.sid) },
  });

  if (!substory) {
    return NextResponse.json({ error: "Substory not found" }, { status: 404 });
  }

  await prisma.story.delete({
    where: { id: substory.id },
  });

  return NextResponse.json({ message: "Substory deleted" }, { status: 200 });
}
