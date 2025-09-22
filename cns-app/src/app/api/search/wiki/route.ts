import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    console.log("Search query", query, "with limit", limit);

    if (typeof query !== "string") {
      throw new Error("Invalid request");
    }

    // Search query in database
    const wikis = await prisma.wiki.findMany({
      where: {
        OR: [
          {
            wikiText: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      take: limit,
    });

    if (wikis.length <= 0) {
      return NextResponse.json({ message: "No wiki found" });
    }
    return NextResponse.json({ message: "Search request successful.", wikis });
  } catch (error) {
    return NextResponse.json(
      { message: "An error has occurred", error },
      { status: 400 }
    );
  }
}
