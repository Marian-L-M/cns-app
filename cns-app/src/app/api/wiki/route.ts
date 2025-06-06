import { wikiSchema } from "@/ValidationSchemas/wiki";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = wikiSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    // Map author ids back to user objects
    const { authors, ...fields } = body;
    const updateData: any = { ...fields };

    // Handle authors field if it exists
    if (authors !== undefined) {
      if (Array.isArray(authors)) {
        updateData.authors = {
          connect: authors.map((authorId: string) => ({
            id: authorId,
          })),
        };
      }
    }

    const newWiki = await prisma.wiki.create({
      data: { ...updateData },
    });
    return NextResponse.json(newWiki, { status: 201 });
  } catch (error) {
    console.error("Error creating Wiki", error);
    return NextResponse.json(
      { error: "Internal Server Eroor" },
      { status: 500 }
    );
  }
}
