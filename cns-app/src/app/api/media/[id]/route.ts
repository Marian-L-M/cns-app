// app/api/media/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import { auth } from "@/auth";

// GET - Fetch a single media item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!mediaItem) {
      return NextResponse.json(
        { error: "Media item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(mediaItem);
  } catch (error) {
    console.error("Media fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media item" },
      { status: 500 }
    );
  }
}

// PATCH - Update a media item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Check if media item exists and user has permission
    const existingMedia = await prisma.mediaItem.findUnique({
      where: { id },
    });

    if (!existingMedia) {
      return NextResponse.json(
        { error: "Media item not found" },
        { status: 404 }
      );
    }

    // To do -> check owner or admin
    // // Optional: Check if user owns the media item
    // if (existingMedia.uploadedById !== session.user.id) {
    //   return NextResponse.json(
    //     { error: "Forbidden: You don't have permission to update this item" },
    //     { status: 403 }
    //   );
    // }

    const updated = await prisma.mediaItem.update({
      where: { id },
      data: {
        ...data,
        // Ensure uploadedById cannot be changed
        uploadedById: existingMedia.uploadedById,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Media update error:", error);
    return NextResponse.json(
      { error: "Failed to update media item" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a media item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if media item exists and user has permission
    const existingMedia = await prisma.mediaItem.findUnique({
      where: { id },
    });

    if (!existingMedia) {
      return NextResponse.json(
        { error: "Media item not found" },
        { status: 404 }
      );
    }

    // To do -> check owner or admin
    // // Optional: Check if user owns the media item
    // if (existingMedia.uploadedById !== session.user.id) {
    //   return NextResponse.json(
    //     { error: "Forbidden: You don't have permission to delete this item" },
    //     { status: 403 }
    //   );
    // }

    await prisma.mediaItem.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Media item deleted successfully",
    });
  } catch (error) {
    console.error("Media delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete media item" },
      { status: 500 }
    );
  }
}
