import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { UTApi } from "uploadthing/server";

// Generate thumbnail with sharp and submit to uplaodthing
const utapi = new UTApi();

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, originalKey } = await req.json();

    // Fetch the original image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    // Generate thumbnail with sharp
    const thumbnailBuffer = await sharp(Buffer.from(imageBuffer))
      .resize(600, 600, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Convert buffer to Blob, then to File for UploadThing
    const blob = new Blob([new Uint8Array(thumbnailBuffer)], {
      type: "image/jpeg",
    });
    const thumbnailFile = new File([blob], `thumb_${originalKey}.jpg`, {
      type: "image/jpeg",
    });

    // Upload thumbnail to UploadThing
    const uploadResponse = await utapi.uploadFiles([thumbnailFile]);

    if (!uploadResponse[0]?.data?.ufsUrl) {
      throw new Error("Failed to upload thumbnail");
    }

    return NextResponse.json({
      thumbnailUrl: uploadResponse[0].data.ufsUrl,
      thumbnailKey: uploadResponse[0].data.key,
    });
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate thumbnail" },
      { status: 500 }
    );
  }
}
