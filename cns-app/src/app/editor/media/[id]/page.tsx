import MediaUploadForm from "@/components/forms/MediaUploadForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import prisma from "@/../prisma/db";
import { Meie_Script } from "next/font/google";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMediaPage({ params }: Props) {
  const resolvedParams = await params;

  const mediaItem = await prisma.mediaItem.findUnique({
    where: { id: resolvedParams.id },
    include: {
      storyMedia: true,
      mapMedia: true,
      wikiMedia: true,
      globalObjectMedia: true,
      globalAreaMedia: true,
      userProfileMedia: true,
      settingsMedia: true,
      MapHierarchyMedia: true,
    },
  });

  if (!mediaItem) {
    return <div className="flex flex-col gap-20 w-full">Media not found</div>;
  }

  return (
    <div className="flex flex-col gap-20 w-full">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
        </TabsList>
        <TabsContent className="flex flex-col gap-8" value="upload">
          <div className="w-full grid grid-cols-8 gap-4 mx-auto relative">
            <div className="col-span-8">
              <h1>Media Upload</h1>
              <MediaUploadForm mediaItem={mediaItem} />
            </div>
          </div>
        </TabsContent>
        <TabsContent className="flex flex-col gap-8" value="library">
          <div className="w-full grid grid-cols-8 gap-4 mx-auto relative">
            <div className="col-span-8">
              <h1>Media Library</h1>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
