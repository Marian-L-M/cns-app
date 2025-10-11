"use client";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog/dialog";
import { Button } from "../button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { MediaItem } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getMediaItems } from "@/lib/actions/media.actions";
import Link from "next/link";
import { Card } from "../card";
import MediaUploadForm from "@/components/forms/MediaUploadForm";

interface MediaLibraryProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  image: string;
  imageFieldName: Path<T>;
  thumbnail: string;
  thumbnailFieldName: Path<T>;
}

export default function MediaLibrary<T extends FieldValues>({
  form,
  image,
  imageFieldName,
  thumbnail,
  thumbnailFieldName,
}: MediaLibraryProps<T>) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize library
  useEffect(() => {
    if (isOpen && mediaItems.length === 0) {
      setIsLoading(true);
      getMediaItems()
        .then(setMediaItems)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, mediaItems.length]);

  // Set form
  const formSetValue = form.setValue as any;

  function setFormImage(media: MediaItem) {
    formSetValue(imageFieldName, media.url);
    formSetValue(thumbnailFieldName, media.thumbnailUrl);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Toggle Media Library</Button>
      </DialogTrigger>
      <DialogContent className="w-[80vw] h-[80vh] max-w-none p-4 flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Media Library</DialogTitle>
          <DialogDescription>Select or upload an image</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="library" className="w-full flex-1">
          <TabsList>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="library">
            {isLoading ? (
              "Loading..."
            ) : (
              <div className="w-full grid grid-cols-8  gap-2">
                {mediaItems.map((media) => (
                  <Card
                    key={`media-${media.id}`}
                    className="flex flex-col items-center p-4 gap-4 w-full hover:opacity-80 overflow-hidden rounded-md border-slate-100"
                    onClick={() => {
                      setFormImage(media);
                    }}
                  >
                    <div className="aspect-square relative w-full">
                      <Image
                        src={media.thumbnailUrl || media.url}
                        alt={media.alt || ""}
                        fill={true}
                      />
                    </div>
                    <h4 className="text-sm">
                      {media.title ? media.title : media.filename}
                    </h4>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="upload">
            <div className="w-full p-4 flex flex-col items-center gap-4">
              <div className="w-1/2">
                <MediaUploadForm />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
