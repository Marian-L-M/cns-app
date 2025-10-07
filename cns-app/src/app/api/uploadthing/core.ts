import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";
import sharp from "sharp";
import { UTApi, UTFile } from "uploadthing/server";

const f = createUploadthing();
const utapi = new UTApi();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "16MB", maxFileCount: 10 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      try {
        // Fetch the uploaded image
        const response = await fetch(file.ufsUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Get image metadata for dimensions
        const imageMetadata = await sharp(buffer).metadata();

        // Generate thumbnail (max 400x400, maintain aspect ratio)
        const thumbnailBuffer = await sharp(buffer)
          .resize(400, 400, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: 80 })
          .toBuffer();

        // Convert Buffer to Uint8Array for Blob compatibility
        const thumbnailFile = new UTFile(
          [new Uint8Array(thumbnailBuffer)],
          `thumb_${file.name}`,
          { type: "image/jpeg" }
        );

        const thumbnailUpload = await utapi.uploadFiles(thumbnailFile);

        let thumbnailUrl = null;
        if (thumbnailUpload.data) {
          thumbnailUrl = thumbnailUpload.data.ufsUrl;
          console.log("Thumbnail generated:", thumbnailUrl);
        }

        return {
          uploadedBy: metadata.userId,
          width: imageMetadata.width ?? null,
          height: imageMetadata.height ?? null,
          thumbnailUrl: thumbnailUrl,
        };
      } catch (error) {
        console.error("Error processing image:", error);
        return {
          uploadedBy: metadata.userId,
          width: null,
          height: null,
          thumbnailUrl: null,
        };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
