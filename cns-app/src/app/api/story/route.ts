import { StoriesSchema } from "@/ValidationSchemas/stories";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/../prisma/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 }
      );
    }

    const currentUserId = session.user.id;
    const body = await request.json();
    const validation = StoriesSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    // Create the story and user story for owner
    const result = await prisma.$transaction(async (tx) => {
      const newStory = await tx.story.create({
        data: body,
      });

      await tx.userStory.create({
        data: {
          userId: currentUserId,
          storyId: newStory.id,
          role: "OWNER",
        },
      });

      //
      return await tx.story.findUnique({
        where: { id: newStory.id },
        include: {
          userStories: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A story with this data already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
