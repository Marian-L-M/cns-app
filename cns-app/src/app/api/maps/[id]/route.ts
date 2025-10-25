import { mapSchema } from "@/ValidationSchemas/maps";
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
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const map = await prisma.map.findUnique({
    where: { id: id },
  });

  if (!map) {
    return NextResponse.json({ error: "Map not found" }, { status: 404 });
  }

  // Regenerate slug from title
  const slug = await generateUniqueSlug(validation.data.title, prisma, "map");

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
    const updateMap = await prisma.map.update({
      where: { id: map.id },
      data: updateData,
    });

    return NextResponse.json(updateMap, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update map" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const map = await prisma.map.findUnique({
    where: { id: id },
  });

  if (!map) {
    return NextResponse.json({ error: "Map not found" }, { status: 404 });
  }

  await prisma.map.delete({
    where: { id: map.id },
  });

  return NextResponse.json({ message: "Map deleted" }, { status: 200 });
}
