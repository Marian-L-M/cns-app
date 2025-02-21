import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  console.log("Search query", query);
  return NextResponse.json({ posts: [] });
}
