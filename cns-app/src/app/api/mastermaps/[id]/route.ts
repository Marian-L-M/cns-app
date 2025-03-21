import { MasterMapSchema } from "@/ValidationSchemas/maps";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/db";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = MasterMapSchema.safeParse(body);
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const masterMap = await prisma.mapHierarchyMaster.findUnique({
    where: { id: id },
  });

  if (!masterMap) {
    return NextResponse.json({ error: "Map not found" }, { status: 404 });
  }

  const updateMap = await prisma.mapHierarchyMaster.update({
    where: { id: masterMap.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateMap, { status: 200 });
}
