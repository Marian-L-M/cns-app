import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";

export async function GET(request: NextRequest) {
  try {
    const authors = await prisma.user.findMany({
      where: {
        role: {
          in: ["AUTHOR"],
        },
      },
      select: {
        id: true,
        RelatedUser: true,
      },
    });

    // filter out authors without a public profile
    const publicAuthors = authors.filter(
      (author) => author.RelatedUser !== null
    );

    return NextResponse.json(publicAuthors, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
