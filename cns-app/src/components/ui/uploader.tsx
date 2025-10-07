import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { UploadButton } from "@/lib/uploadthing/utils";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

interface UploadComponentProps<T extends FieldValues> {
  image: string;
  form: UseFormReturn<T>;
  fieldName: Path<T>;
}

interface UploadThingResponse {
  ufsUrl: string; // Changed from url to ufsUrl
  key: string;
  name: string;
  size: number;
  type: string;
}

// Upload image and return url only
export function UploadComponent<T extends FieldValues>({
  image,
  form,
  fieldName,
}: UploadComponentProps<T>) {
  return (
    <Card>
      <CardContent className="space-y-2 mt-2 flex flex-col gap-2">
        {image && (
          <Image
            src={image}
            alt={fieldName}
            className="object-cover object-center"
            width={240}
            height={240}
          />
        )}
        <UploadButton
          appearance={{
            button: {
              background: "#fff",
              color: "#6b7280",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              border: "1px solid #6b7280",
              cursor: "pointer",
              transition: "all 0.2s",
            },
            container: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            },
            allowedContent: {
              color: "#6b7280",
              fontSize: "14px",
            },
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res: { url: string }[]) => {
            form.setValue(fieldName, res[0].url as PathValue<T, Path<T>>);
          }}
          onUploadError={(error: Error) => {
            toast.error("Image upload failed", {
              className: "error",
              description: `ERROR! ${error.message}`,
            });
          }}
        />
      </CardContent>
    </Card>
  );
}

// Upload image to MediaItem form and generate thumbnail
export function UploadMediaItem<T extends FieldValues>({
  image,
  form,
  fieldName,
}: UploadComponentProps<T>) {
  // Function to generate thumbnail via API
  const generateThumbnail = async (
    imageUrl: string,
    originalKey: string
  ): Promise<string> => {
    const response = await fetch("/api/media/thumbnail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, originalKey }),
    });

    if (!response.ok) {
      throw new Error("Thumbnail generation failed");
    }

    const data = await response.json();
    return data.thumbnailUrl;
  };

  return (
    <Card>
      <CardContent className="space-y-2 mt-2 flex flex-col gap-2">
        {image && (
          <Image
            src={image}
            alt={fieldName}
            className="object-cover object-center"
            width={240}
            height={240}
          />
        )}
        <UploadButton
          appearance={{
            button: {
              background: "#fff",
              color: "#6b7280",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              border: "1px solid #6b7280",
              cursor: "pointer",
              transition: "all 0.2s",
            },
            container: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            },
            allowedContent: {
              color: "#6b7280",
              fontSize: "14px",
            },
          }}
          endpoint="imageUploader"
          onClientUploadComplete={async (res: UploadThingResponse[]) => {
            const uploadedFile = res[0];
            // Use ufsUrl instead of url
            form.setValue(
              fieldName,
              uploadedFile.ufsUrl as PathValue<T, Path<T>>
            );
            const formSetValue = form.setValue as any;

            // Set basic metadata
            formSetValue("filename", uploadedFile.name);
            formSetValue("originalName", uploadedFile.name);
            formSetValue("fileKey", uploadedFile.key);
            formSetValue("mimeType", uploadedFile.type);
            formSetValue("fileSize", uploadedFile.size);
            formSetValue("provider", "uploadthing");

            // Get image dimensions and generate thumbnail if it's an image
            if (uploadedFile.type.startsWith("image/")) {
              const img = document.createElement("img");
              img.crossOrigin = "anonymous";

              img.onload = async () => {
                formSetValue("width", img.naturalWidth);
                formSetValue("height", img.naturalHeight);

                // Generate and upload thumbnail
                try {
                  toast.info("Generating thumbnail...");
                  const thumbnailUrl = await generateThumbnail(
                    uploadedFile.ufsUrl,
                    uploadedFile.key
                  );
                  formSetValue("thumbnailUrl", thumbnailUrl);
                  toast.success(
                    "Thumbnail generated and uploaded successfully"
                  );
                } catch (error) {
                  console.error("Thumbnail generation error:", error);
                  toast.error("Failed to generate thumbnail");
                }
              };

              img.src = uploadedFile.ufsUrl;
            }

            toast.success("Image uploaded successfully");
          }}
          onUploadError={(error: Error) => {
            toast.error("Image upload failed", {
              className: "error",
              description: `ERROR! ${error.message}`,
            });
          }}
        />
      </CardContent>
    </Card>
  );
}
