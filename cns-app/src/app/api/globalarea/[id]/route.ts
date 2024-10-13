import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/db";
import { GlobalAreasSchema } from "@/ValidationSchemas/global";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = GlobalAreasSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const globalArea = await prisma.globalArea.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!globalArea) {
    return NextResponse.json(
      { error: "Global Area Not Found" },
      { status: 400 }
    );
  }

  const updateGlobalArea = await prisma.globalArea.update({
    where: { id: globalArea.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateGlobalArea);
}
