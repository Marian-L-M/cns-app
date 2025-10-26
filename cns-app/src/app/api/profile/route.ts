import { userProfileSchema } from "@/ValidationSchemas/users";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { generateUniqueSlug } from "@/lib/slug";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = userProfileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const slug = await generateUniqueSlug(
      validation.data.displayName,
      prisma,
      "userProfile"
    );

    const newProfile = await prisma.userProfile.create({
      data: { ...body, slug },
    });

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error("Error creating user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
