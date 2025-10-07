// Full AI approach is not working
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, FileImage } from "lucide-react";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing/utils";
import { ClientUploadedFileData } from "uploadthing/types";
import Image from "next/image";

type UploadedFile = {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  key: string;
};

type FileMetadata = {
  title: string;
  alt: string;
  caption: string;
  tags: string;
};

type MetadataCollection = Record<string, FileMetadata>;

type MediaItemPayload = {
  fileKey: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  url: string;
  provider: string;
  title: string;
  alt: string;
  caption: string;
  tags: string[];
};

export function MediaUploadForm() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
  const [metadata, setMetadata] = useState<MetadataCollection>({});

  const handleUploadComplete = (
    res: ClientUploadedFileData<{ uploadedBy: string }>[]
  ) => {
    console.log("Files uploaded:", res);
    const newFiles: UploadedFile[] = res.map((file) => ({
      id: file.key,
      url: file.ufsUrl,
      name: file.name,
      size: file.size,
      type: file.type ?? "image/jpeg",
      key: file.key,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Initialize metadata for new files
    const newMetadata: MetadataCollection = {};
    newFiles.forEach((file) => {
      newMetadata[file.id] = {
        title: "",
        alt: "",
        caption: "",
        tags: "",
      };
    });
    setMetadata((prev) => ({ ...prev, ...newMetadata }));
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    alert(`Upload failed: ${error.message}`);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setMetadata((prev) => {
      const newMetadata = { ...prev };
      delete newMetadata[fileId];
      return newMetadata;
    });
    if (
      activeFileIndex !== null &&
      uploadedFiles[activeFileIndex]?.id === fileId
    ) {
      setActiveFileIndex(null);
    }
  };

  const updateMetadata = (
    fileId: string,
    field: keyof FileMetadata,
    value: string
  ) => {
    setMetadata((prev) => ({
      ...prev,
      [fileId]: {
        ...prev[fileId],
        [field]: value,
      },
    }));
  };

  const saveMediaItems = async () => {
    try {
      const mediaItems: MediaItemPayload[] = uploadedFiles.map((file) => ({
        fileKey: file.key,
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        url: file.url,
        provider: "uploadthing",
        title: metadata[file.id]?.title || "",
        alt: metadata[file.id]?.alt || "",
        caption: metadata[file.id]?.caption || "",
        tags: metadata[file.id]?.tags
          ? metadata[file.id].tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      }));

      const response = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaItems }),
      });

      if (!response.ok) throw new Error("Failed to save media items");

      alert("Media items saved successfully!");
      setUploadedFiles([]);
      setMetadata({});
      setActiveFileIndex(null);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save media items");
    }
  };

  const activeFile: UploadedFile | null =
    activeFileIndex !== null ? uploadedFiles[activeFileIndex] : null;
  const activeMetadata: FileMetadata | undefined = activeFile
    ? metadata[activeFile.id]
    : undefined;

  return (
    <div className="w-full grid grid-cols-8 gap-6">
      {/* Upload Section */}
      <Card className="col-span-5">
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>
            Choose files or drag and drop to upload
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Button */}
          <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg">
            <FileImage className="w-12 h-12 text-muted-foreground" />
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
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
            />
          </div>

          {/* Upload Dropzone */}
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            className="border-2 border-dashed ut-button:bg-primary ut-button:ut-readying:bg-primary/50"
          />

          {/* Uploaded Files Grid */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">
                Uploaded Files ({uploadedFiles.length})
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                      activeFileIndex === index
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                    onClick={() => setActiveFileIndex(index)}
                  >
                    <div className="aspect-square">
                      <Image
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-2 truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metadata Editor */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Image Details</CardTitle>
          <CardDescription>
            {activeFile
              ? "Edit metadata for selected image"
              : "Select an image to edit details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeFile ? (
            <div className="space-y-4">
              {/* Preview */}
              <div className="aspect-video rounded-lg overflow-hidden border">
                <Image
                  src={activeFile.url}
                  alt={activeFile.name}
                  className="w-full h-full object-contain bg-muted"
                />
              </div>

              {/* Metadata Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter image title"
                    value={activeMetadata?.title || ""}
                    onChange={(e) =>
                      updateMetadata(activeFile.id, "title", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alt">Alt Text</Label>
                  <Input
                    id="alt"
                    placeholder="Describe the image for accessibility"
                    value={activeMetadata?.alt || ""}
                    onChange={(e) =>
                      updateMetadata(activeFile.id, "alt", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea
                    id="caption"
                    placeholder="Optional caption"
                    value={activeMetadata?.caption || ""}
                    onChange={(e) =>
                      updateMetadata(activeFile.id, "caption", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="tag1, tag2, tag3"
                    value={activeMetadata?.tags || ""}
                    onChange={(e) =>
                      updateMetadata(activeFile.id, "tags", e.target.value)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate tags with commas
                  </p>
                </div>

                {/* File Info */}
                <div className="pt-4 border-t space-y-1 text-sm text-muted-foreground">
                  <p>File: {activeFile.name}</p>
                  <p>Size: {(activeFile.size / 1024).toFixed(2)} KB</p>
                  <p>Type: {activeFile.type}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <FileImage className="w-16 h-16 mb-4" />
              <p>No image selected</p>
              <p className="text-sm">
                Upload and select an image to edit its details
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      {uploadedFiles.length > 0 && (
        <div className="col-span-8 flex justify-end">
          <Button onClick={saveMediaItems} size="lg">
            Save {uploadedFiles.length}{" "}
            {uploadedFiles.length === 1 ? "Image" : "Images"} to Library
          </Button>
        </div>
      )}
    </div>
  );
}
