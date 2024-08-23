import { wikiSchema } from "@/ValidationSchemas/wiki";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/db";

interface Props {
  params: { id: string };
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
