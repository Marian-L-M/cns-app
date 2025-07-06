import { CanvasStylesSchema } from "@/ValidationSchemas/styles";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const canvasStyleItem = await prisma.canvasStyleItem.findUnique({
      where: { id: id },
    });

    if (!canvasStyleItem) {
      return NextResponse.json(
        { error: "canvasStyleItem not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(canvasStyleItem, { status: 200 });
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
  const validation = CanvasStylesSchema.safeParse(body);
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const canvasStyleItem = await prisma.canvasStyleItem.findUnique({
    where: { id: id },
  });

  if (!canvasStyleItem) {
    return NextResponse.json(
      { error: "canvasStyleItem not found" },
      { status: 404 }
    );
  }

  try {
    const updatecanvasStyleItem = await prisma.canvasStyleItem.update({
      where: { id: canvasStyleItem.id },
      data: body,
    });

    return NextResponse.json(updatecanvasStyleItem, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update canvasStyleItem" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const canvasStyleItem = await prisma.canvasStyleItem.findUnique({
    where: { id: id },
  });

  if (!canvasStyleItem) {
    return NextResponse.json(
      { error: "canvasStyleItem not found" },
      { status: 404 }
    );
  }

  await prisma.canvasStyleItem.delete({
    where: { id: canvasStyleItem.id },
  });

  return NextResponse.json(
    { message: "canvasStyleItem deleted" },
    { status: 200 }
  );
}
