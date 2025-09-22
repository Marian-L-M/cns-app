import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { GlobalAreasSchema } from "@/ValidationSchemas/global";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = GlobalAreasSchema.safeParse(body);
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  console.log("id" + id);
  const globalArea = await prisma.globalArea.findUnique({
    where: { id: id },
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
