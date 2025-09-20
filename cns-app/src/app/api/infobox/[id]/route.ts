import { WikiInfoboxItemSchema } from "@/ValidationSchemas/wiki";
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
    const wikiInfoboxItem = await prisma.wikiInfoboxItem.findUnique({
      where: { id: id },
    });

    if (!wikiInfoboxItem) {
      return NextResponse.json(
        { error: "wikiInfoboxItem not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(wikiInfoboxItem, { status: 200 });
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
  const validation = WikiInfoboxItemSchema.safeParse(body);
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const wikiInfoboxItem = await prisma.wikiInfoboxItem.findUnique({
    where: { id: id },
  });

  if (!wikiInfoboxItem) {
    return NextResponse.json(
      { error: "wikiInfoboxItem not found" },
      { status: 404 }
    );
  }

  try {
    const updatewikiInfoboxItem = await prisma.wikiInfoboxItem.update({
      where: { id: wikiInfoboxItem.id },
      data: body,
    });

    return NextResponse.json(updatewikiInfoboxItem, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update wikiInfoboxItem" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const wikiInfoboxItem = await prisma.wikiInfoboxItem.findUnique({
    where: { id: id },
  });

  if (!wikiInfoboxItem) {
    return NextResponse.json(
      { error: "wikiInfoboxItem not found" },
      { status: 404 }
    );
  }

  await prisma.wikiInfoboxItem.delete({
    where: { id: wikiInfoboxItem.id },
  });

  return NextResponse.json(
    { message: "wikiInfoboxItem deleted" },
    { status: 200 }
  );
}
