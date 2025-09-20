import StoryForm from "@/components/forms/StoryForm";
import prisma from "@/../prisma/db";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoryDisplayModule from "@/components/displays/StoryDisplayModule";
import { fetchMapData } from "@/lib/fetchMapData";
import Link from "next/link";
import StatusContextProvider from "@/store/statusContext";

interface Props {
  params: { id: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const VALID_TABS = ["setup", "substories"];

export default async function EditStory({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const modal = resolvedSearchParams.modal;
  const id = parseInt(resolvedParams.id);

  let mapData: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;

  // Set active tab
  const activeTab =
    typeof modal === "string" && VALID_TABS.includes(modal) ? modal : "setup";

  // Fetch story
  const story = await prisma?.story.findUnique({
    where: { id },
    include: {
      userStories: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      },
      assignedToMap: true,
    },
  });

  if (!story) {
    return <p className="text-destructive">Story not found</p>;
  }

  // fetch substories
  const substories = await prisma.subStory.findMany({
    where: { storyId: story.id },
    include: {
      canvasStyles: true,
    },
  });

  // fetch mapdata
  try {
    // 240819 This is stupid - change fetchMapData to always expect an integer
    mapData = await fetchMapData(story.assignedToMapID?.toString() || "");

    if (!mapData.map) {
      error = "Map not found";
    }
  } catch (err) {
    error = "Failed to fetch data";
  }

  // Check if current user has permission to edit
  const session = await requireOwnerOrAdmin({
    userJunction: story.userStories,
  });

  return (
    <div className="w-full flex flex-col gap-4" id="story-editor-module">
      <h1 className="text-2xl">Edit Story</h1>
      {/* <Tabs defaultValue={activeTab} className="w-full"> */}
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="substories">Substories</TabsTrigger>
        </TabsList>
        <TabsContent value="setup">
          <div className="flex gap-4">
            <StoryForm
              story={story}
              substories={substories}
              user={session.user}
            />
          </div>
        </TabsContent>
        <TabsContent value="substories">
          <div className="flex gap-4">
            <div className="w-4/5">
              <StatusContextProvider>
                <StoryDisplayModule mapData={mapData} story={substories} />
              </StatusContextProvider>
            </div>
            <div className="w-1/5">
              <div
                className="col-span-1 flex flex-col gap-4"
                id="substory-overview-list"
              >
                <h1 className="text-2xl font-bold">Substory Overview List</h1>
                <div className="flex flex-col gap-4" id="area-container">
                  {substories.map((substory) => (
                    <Link
                      key={substory.id}
                      href={`/editor/stories/${id}/substories/${substory.id}`}
                      className="flex gap-2 p-4 bg-slate-800 text-white rounded-lg hover:opacity-90"
                    >
                      <h6>{substory.title}</h6>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
