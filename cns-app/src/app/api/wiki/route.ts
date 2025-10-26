import { wikiSchema } from "@/ValidationSchemas/wiki";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { auth } from "@/auth";
import { generateUniqueSlug } from "@/lib/slug";

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
    const validation = wikiSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    // Generate slug from title
    const slug = await generateUniqueSlug(
      validation.data.title,
      prisma,
      "wiki"
    );

    // Create wiki and user junction for owner
    const result = await prisma.$transaction(async (tx) => {
      const newWiki = await tx.wiki.create({
        data: { ...body, slug },
      });

      await tx.userWiki.create({
        data: {
          userId: currentUserId,
          wikiId: newWiki.id,
          role: "OWNER",
        },
      });

      return await tx.wiki.findUnique({
        where: { id: newWiki.id },
        include: {
          userWikis: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating Wiki", error);
    return NextResponse.json(
      { error: "Internal Server Eroor" },
      { status: 500 }
    );
  }
}
