import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { WikiInfoboxItemSchema } from "@/ValidationSchemas/wiki";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = WikiInfoboxItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const newWikiInfoboxItem = await prisma.wikiInfoboxItem.create({
      data: { ...body },
    });
    return NextResponse.json(newWikiInfoboxItem, { status: 201 });
  } catch (error) {
    console.error("Error creating Infobox Item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
