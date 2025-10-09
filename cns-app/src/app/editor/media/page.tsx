import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireAuthorOrAdmin } from "@/lib/auth-guards";
import MediaUploadForm from "@/components/forms/MediaUploadForm";
import prisma from "@/../prisma/db";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default async function mediaPage() {
  const session = await requireAuthorOrAdmin();

  const mediaItems = await prisma.mediaItem.findMany();

  return (
    <div className="flex gap-4">
      <div className="flex-[3] flex flex-col gap-4">
        <h2 className="text-md font-semibold">Media Library</h2>
        <div className="card-container w-full grid grid-cols-6 col-span-6 gap-2 ">
          {mediaItems.map((media) => (
            <Link key={`media-${media.id}`} href={`/editor/media/${media.id}`}>
              <Card className="flex flex-col items-center p-4 gap-4 w-full hover:opacity-80 overflow-hidden rounded-md border-slate-100">
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
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-md font-semibold">Media Upload</h2>
        <div className="text-xs">
          <MediaUploadForm />
        </div>
      </div>
    </div>
  );
}
