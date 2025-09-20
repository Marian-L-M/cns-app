import { AdminSettingsSchema } from "@/ValidationSchemas/admin";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = AdminSettingsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const newSettings = await prisma.adminSettings.create({
      data: { ...body },
    });

    return NextResponse.json(newSettings, { status: 201 });
  } catch (error) {
    console.error("Error creating Settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
