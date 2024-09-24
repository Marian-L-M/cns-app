import { wikiSchema } from "@/ValidationSchemas/wiki";
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
    const wiki = await prisma.wiki.findUnique({
      where: { id: id },
    });

    if (!wiki) {
      return NextResponse.json({ error: "Wiki not found" }, { status: 404 });
    }

    return NextResponse.json(wiki, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Todo 240823 rework  to allow name as slug
export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = wikiSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const wiki = await prisma.wiki.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!wiki) {
    return NextResponse.json({ error: "Wiki not found" }, { status: 404 });
  }

  const updateWiki = await prisma.wiki.update({
    where: { id: wiki.id },
    data: { ...body },
  });

  return NextResponse.json(updateWiki, { status: 200 });
}

// Todo 240823 add deletetion route
