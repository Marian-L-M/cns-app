import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/db";
import { GlobalObjectsSchema } from "@/ValidationSchemas/global";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = GlobalObjectsSchema.safeParse(body);
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const globalObject = await prisma.globalObject.findUnique({
    where: { id: id },
  });

  if (!globalObject) {
    return NextResponse.json(
      { error: "Global Object Not Found" },
      { status: 400 }
    );
  }

  const updateGlobalObject = await prisma.globalObject.update({
    where: { id: globalObject.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateGlobalObject);
}
