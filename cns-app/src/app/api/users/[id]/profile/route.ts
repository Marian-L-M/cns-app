import { userProfileSchema } from "@/ValidationSchemas/users";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = userProfileSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const newProfile = await prisma.userProfile.create({
    data: { ...body },
  });

  return NextResponse.json(newProfile, { status: 201 });
}
