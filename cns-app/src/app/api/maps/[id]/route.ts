import { mapSchema } from "@/ValidationSchemas/maps";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/db";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const map = await prisma.map.findUnique({
      where: { id: id },
    });

    if (!map) {
      return NextResponse.json({ error: "Map not found" }, { status: 404 });
    }

    return NextResponse.json(map, { status: 200 });
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
  const validation = mapSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const map = await prisma.map.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!map) {
    return NextResponse.json({ error: "Map not found" }, { status: 404 });
  }

  const updateMap = await prisma.map.update({
    where: { id: map.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateMap, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const map = await prisma.map.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!map) {
    return NextResponse.json({ error: "Map not found" }, { status: 404 });
  }

  await prisma.map.delete({
    where: { id: map.id },
  });

  return NextResponse.json({ message: "Map deleted" }, { status: 200 });
}
