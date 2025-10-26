import Image from "next/image";
import prisma from "@/../prisma/db";
import StatusContextProvider from "@/store/statusContext";
import StoryDisplayModule from "@/components/displays/StoryDisplayModule";
import { fetchMapData } from "@/lib/fetchMapData";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function ViewStory({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let mapData: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;

  const story = await prisma.story.findUnique({
    where: { slug: slug },
  });

  if (!story) {
    return <div className="text-destructive">Story not found</div>;
  }

  // fetch substories
  const substories = await prisma.subStory.findMany({
    where: { storyId: story.id },
  });

  const storyDisplayData = substories.map((substory) => ({
    ...substory,
    nodes: substory.nodes as StoryNode[], // Type assertion for JSON field
  }));

  // fetch mapdata
  try {
    // 240819 This is stupid - remove and work with include instead
    mapData = await fetchMapData(story.assignedToMapID?.toString() || "");

    if (!mapData.map) {
      error = "Map not found";
    }
  } catch (err) {
    error = "Failed to fetch data";
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <Breadcrumb>
        <BreadcrumbList className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/wiki">Wikis</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{story.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex flex-col gap-4">
        {story.bannerUrl && (
          <div className="w-full h-64 relative">
            <Image
              src={story.bannerUrl}
              alt={`${story.title}-banner`}
              fill={true}
              className="relative"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
        <div className="w-full flex gap-4">
          <div className="col-span-6">
            <StatusContextProvider>
              <StoryDisplayModule mapData={mapData} story={storyDisplayData} />
            </StatusContextProvider>
          </div>
          <div className="col-span-3 flex flex-col gap-4">
            <h2 className="text-2xl">{story.title}</h2>
            <div id="description">{story.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
