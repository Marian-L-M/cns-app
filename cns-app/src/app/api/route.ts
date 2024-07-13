import { storiesSchema } from "../../ValidationSchemas/stories";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../prisma/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = storiesSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const newStory = await prisma.entry.create({
    data: { ...body },
  });

  return NextResponse.json(newStory, { status: 201 });
}
