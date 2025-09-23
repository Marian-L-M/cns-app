import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    if (typeof query !== "string") {
      throw new Error("Invalid request");
    }

    // Search query in database
    const mastermaps = await prisma.mapHierarchyMaster.findMany({
      where: {
        title: {
          contains: query,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      take: limit,
    });

    if (mastermaps.length <= 0) {
      return NextResponse.json({ message: "No Mastermap found" });
    }
    return NextResponse.json({
      message: "Search request successful.",
      mastermaps,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "An error has occurred", error },
      { status: 400 }
    );
  }
}
