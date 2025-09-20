import { wikiSchema } from "@/ValidationSchemas/wiki";
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
    const wiki = await prisma.wiki.findUnique({
      where: { id: id },
      include: {
        infoboxItems: true,
      },
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
