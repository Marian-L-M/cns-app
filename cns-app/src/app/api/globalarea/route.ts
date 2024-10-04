import { GlobalAreasSchema } from "@/ValidationSchemas/global";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = GlobalAreasSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const newGlobalArea = await prisma.globalArea.create({
    data: { ...body },
  });

  return NextResponse.json(newGlobalArea, { status: 201 });
}
