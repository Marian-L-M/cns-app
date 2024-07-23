import { storiesSchema } from "@/ValidationSchemas/stories";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/db";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = storiesSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const entry = await prisma.entry.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  const updateEntry = await prisma.entry.update({
    where: { id: entry.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateEntry, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const entry = await prisma.entry.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  await prisma.entry.delete({
    where: { id: entry.id },
  });

  return NextResponse.json({ message: "Entry deleted" }, { status: 200 });
}
