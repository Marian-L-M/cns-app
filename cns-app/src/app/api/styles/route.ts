import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { CanvasStylesSchema } from "@/ValidationSchemas/styles";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = CanvasStylesSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const newStylesItem = await prisma.canvasStyleItem.create({
      data: { ...body },
    });
    return NextResponse.json(newStylesItem, { status: 201 });
  } catch (error) {
    console.error("Error creating Style Item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
