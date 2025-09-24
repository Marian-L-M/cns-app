import ReactMarkDown from "react-markdown";
import { AdminSettings } from "@prisma/client";
import prisma from "@/../prisma/db";

import DataTable from "./DataTable";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import StatusContextProvider from "@/store/statusContext";
import StoryDisplayModule from "@/components/displays/StoryDisplayModule";
import { fetchMapData } from "@/lib/fetchMapData";
import StoryCardContainer from "@/components/story/StoryCardContainer";

export const metadata = {
  title: `Stories`,
};

interface titleProps {
  numberSortedTextGroup: AdminSettings[];
}

export default async function Stories() {
  const settings = await prisma.adminSettings.findMany({
    where: {
      category: "PAGE",
      subCategory: "story",
    },
    orderBy: {
      order: "asc",
    },
  });

  // Configuration types
  const contentTypes = ["text", "mainText", "mainTitle", "subTitle"];

  // Group content items by order number
  const groupedContent = settings
    .filter((item) => contentTypes.includes(item.type))
    .reduce((acc, item) => {
      if (!acc[item.order]) {
        acc[item.order] = [];
      }
      acc[item.order].push(item);
      return acc;
    }, {} as Record<number, AdminSettings[]>);

  const storyId = settings.find((item) => item.type === "storyId");
  const mainTextGroup = groupedContent["1"];

  // Custom sections
  const storyList = settings.find((item) => item.type === "setStoryList");
  const featuredStories = settings.find(
    (item) => item.type === "setFeaturedStories"
  );
  const newStories = settings.find((item) => item.type === "setNewStories");
  const exploreStories = settings.find(
    (item) => item.type === "setExploreStories"
  );

  return (
    <div className="flex flex-col gap-20 w-full">
      <Tabs defaultValue="read" className="w-full">
        {/* <TabsList className="absolute top-0 left-0 -translate-y-full">
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="revisions">Revisions</TabsTrigger>
        </TabsList> */}
        <TabsContent className="flex flex-col gap-8" value="read">
          <div
            id="top-content"
            className="w-full grid grid-cols-8 gap-4 mx-auto relative"
          >
            {/* General contents */}
            {!storyId ? (
              <>
                {mainTextGroup && (
                  <div className="col-span-8">
                    <TitleSection numberSortedTextGroup={mainTextGroup} />
                  </div>
                )}
              </>
            ) : (
              <>
                {mainTextGroup && (
                  <div className="col-span-8">
                    <TitleSection numberSortedTextGroup={mainTextGroup} />
                  </div>
                )}
                <div className="col-span-6">
                  <StoryDisplay storyId={storyId} />
                </div>
              </>
            )}
            {/* Special contents */}
            {/* Cards */}
            {newStories && (
              <div className="col-span-2" style={{ order: newStories.order }}>
                <StoryCardContainer
                  type={newStories.type}
                  amount={parseInt(newStories.value)}
                />
              </div>
            )}
            {featuredStories && (
              <div
                className="col-span-2"
                style={{ order: featuredStories.order }}
              >
                <StoryCardContainer
                  type={featuredStories.type}
                  amount={parseInt(featuredStories.value)}
                />
              </div>
            )}
            {exploreStories && (
              <div
                className="col-span-2"
                style={{ order: exploreStories.order }}
              >
                <StoryCardContainer
                  type={exploreStories.type}
                  amount={parseInt(exploreStories.value)}
                />
              </div>
            )}
            {/* Render grouped content sections */}
            {Object.keys(groupedContent)
              .filter((orderNumber) => orderNumber !== "1") // Skip the main text group as it's rendered above
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((orderNumber) => {
                const group = groupedContent[parseInt(orderNumber)];
                const groupMainTitle = group.find(
                  (item) => item.type === "mainTitle"
                );
                const groupMainText = group.find(
                  (item) => item.type === "mainText"
                );
                const groupSubTitle = group.find(
                  (item) => item.type === "subTitle"
                );
                const groupOtherText = group.find(
                  (item) => item.type === "text"
                );

                return (
                  <div
                    key={orderNumber}
                    className="col-span-2 flex flex-col gap-4 p-4 border border-gray-200 rounded-xl self-stretch"
                    style={{ order: parseInt(orderNumber) }}
                  >
                    {groupMainTitle && renderContentItem(groupMainTitle)}
                    {groupSubTitle && renderContentItem(groupSubTitle)}
                    {groupMainText && renderContentItem(groupMainText)}
                    {groupOtherText && renderContentItem(groupOtherText)}
                  </div>
                );
              })}
            {/* List */}
            {storyList && (
              <div className="col-span-8" style={{ order: storyList.order }}>
                <DataTable take={parseInt(storyList.value)} />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Content blocks
function TitleSection({ numberSortedTextGroup }: titleProps) {
  const mainTitle = numberSortedTextGroup?.find(
    (item) => item.type === "mainTitle"
  );
  const mainText = numberSortedTextGroup?.find(
    (item) => item.type === "mainText"
  );
  const mainSubTitle = numberSortedTextGroup?.find(
    (item) => item.type === "subTitle"
  );
  const mainOtherText = numberSortedTextGroup?.find(
    (item) => item.type === "text"
  );

  return (
    <div
      className="w-full p-4 flex flex-col gap-2 border border-slate-200 rounded-md"
      id="title-container"
    >
      <h1 className="w-full text-2xl font-bold ">{mainTitle?.value}</h1>
      <p className="text-md">{mainText?.value}</p>
      {(mainSubTitle || mainOtherText) && (
        <div className="w-full flex flex-col gap-2">
          <h3 className="text-xl font-semibold  bg-slate-100 px-2 py-1">
            {mainSubTitle?.value}
          </h3>
          <ReactMarkDown className={"prose dark:prose-invert text-md"}>
            {mainText?.value}
          </ReactMarkDown>
        </div>
      )}
    </div>
  );
}

async function StoryDisplay({ storyId }: { storyId: AdminSettings }) {
  const idNum = parseInt(storyId.value);
  let mapData: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;
  if (!storyId.value || isNaN(idNum)) {
    return <div className="text-destructive">Invalid story ID</div>;
  }

  const story = await prisma.story.findUnique({
    where: { id: idNum },
    include: {
      subStories: true,
      assignedToMap: {
        include: {
          objects: true,
          area: true,
          canvasStyles: true,
        },
      },
    },
  });

  if (!story) {
    return <div className="text-destructive">Story not found</div>;
  }

  const storyDisplayData = story.subStories.map((substory) => ({
    ...substory,
    nodes: substory.nodes as StoryNode[], // Type assertion for JSON field
  }));

  // fetch mapdata
  try {
    // 240819 This is stupid - remove and work with include instead
    // mapData return an object of map/mapArea/mapObject. Just have a map object instead with areas and objects included.
    mapData = await fetchMapData(story.assignedToMapID?.toString() || "");

    if (!mapData.map) {
      error = "Map not found";
    }
  } catch (err) {
    error = "Failed to fetch data";
  }

  return (
    <div className="w-full relative">
      <StatusContextProvider>
        <StoryDisplayModule mapData={mapData} story={storyDisplayData} />
      </StatusContextProvider>
    </div>
  );
}

// to do: Unify with wiki components
function renderContentItem(item: AdminSettings) {
  switch (item.type) {
    case "mainTitle":
      return (
        <h2 key={item.id} className="text-2xl font-bold">
          {item.value}
        </h2>
      );
    case "subTitle":
      return (
        <h3
          key={item.id}
          className="text-xl font-semibold bg-slate-100 px-2 py-1"
        >
          {item.value}
        </h3>
      );
    case "mainText":
    case "text":
      return (
        <ReactMarkDown
          key={item.id}
          className="prose dark:prose-invert text-md"
        >
          {item.value}
        </ReactMarkDown>
      );
    default:
      return null;
  }
}
