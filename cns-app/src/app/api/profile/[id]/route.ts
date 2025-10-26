import { userProfileSchema } from "@/ValidationSchemas/users";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { generateUniqueSlug } from "@/lib/slug";

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
    const profile = await prisma.userProfile.findUnique({
      where: { id: id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
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
  const validation = userProfileSchema.safeParse(body);
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const profile = await prisma.userProfile.findUnique({
    where: { id: id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Regenerate slug from title
  const slug = await generateUniqueSlug(
    profile.displayName,
    prisma,
    "userProfile",
    profile.id
  );

  try {
    const updateProfile = await prisma.userProfile.update({
      where: { id: profile.id },
      data: { ...body, slug },
    });

    return NextResponse.json(updateProfile, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update canvasStyleItem" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const profile = await prisma.userProfile.findUnique({
    where: { id: id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  await prisma.userProfile.delete({
    where: { id: profile.id },
  });

  return NextResponse.json({ message: "Profile deleted" }, { status: 200 });
}
