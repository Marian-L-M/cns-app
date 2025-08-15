import { MasterMapSchema } from "@/ValidationSchemas/maps";
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
    const masterMap = await prisma.mapHierarchyMaster.findUnique({
      where: { id: id },
    });

    if (!masterMap) {
      return NextResponse.json(
        { error: "masterMap not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(masterMap, { status: 200 });
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
    return NextResponse.json({ error: "Mastermap not found" }, { status: 404 });
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
    const updateMap = await prisma.mapHierarchyMaster.update({
      where: { id: masterMap.id },
      data: updateData,
    });

    return NextResponse.json(updateMap, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update Mastermap" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const mapHierarchyMaster = await prisma.mapHierarchyMaster.findUnique({
    where: { id: id },
  });

  if (!mapHierarchyMaster) {
    return NextResponse.json(
      { error: "Map Master not found" },
      { status: 404 }
    );
  }

  await prisma.mapHierarchyMaster.delete({
    where: { id: mapHierarchyMaster.id },
  });

  return NextResponse.json({ message: "Map Master deleted" }, { status: 200 });
}
