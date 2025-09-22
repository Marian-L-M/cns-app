import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { AdminSettingsSchema } from "@/ValidationSchemas/admin";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const setting = await prisma.adminSettings.findUnique({
      where: { id: id },
    });

    if (!setting) {
      return NextResponse.json(
        { error: "Settings item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(setting, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = AdminSettingsSchema.safeParse(body);
  const resolvedParams = await params;

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  try {
    const settings = await prisma.adminSettings.findUnique({
      where: { id: parseInt(resolvedParams.id) },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Settings item Not Found" },
        { status: 400 }
      );
    }

    const updateSettings = await prisma.adminSettings.update({
      where: { id: settings.id },
      data: {
        ...body,
      },
    });

    return NextResponse.json(updateSettings);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;

  const setting = await prisma.adminSettings.findUnique({
    where: { id: parseInt(resolvedParams.id) },
  });

  if (!setting) {
    return NextResponse.json(
      { error: "Setting item not found" },
      { status: 404 }
    );
  }

  await prisma.adminSettings.delete({
    where: { id: setting.id },
  });

  return NextResponse.json(
    { message: "Setting item deleted" },
    { status: 200 }
  );
}
