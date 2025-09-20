import { ChildMapSchema } from "@/ValidationSchemas/maps";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/db";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = ChildMapSchema.safeParse(body);
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const childMap = await prisma.mapHierarchyChild.findUnique({
    where: { id: id },
  });

  if (!childMap) {
    return NextResponse.json({ error: "Map not found" }, { status: 404 });
  }

  const updateMap = await prisma.mapHierarchyChild.update({
    where: { id: childMap.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateMap, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const mapHierarchyChild = await prisma.mapHierarchyChild.findUnique({
    where: { id: id },
  });

  if (!mapHierarchyChild) {
    return NextResponse.json({ error: "Map not found" }, { status: 404 });
  }

  await prisma.mapHierarchyChild.delete({
    where: { id: mapHierarchyChild.id },
  });

  return NextResponse.json({ message: "Map deleted" }, { status: 200 });
}
