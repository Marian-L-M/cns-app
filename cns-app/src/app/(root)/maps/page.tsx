import ReactMarkDown from "react-markdown";
import { AdminSettings } from "@prisma/client";
import prisma from "@/../prisma/db";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { fetchMapData, fetchMasterMap } from "@/lib/fetchMapData";
import StatusContextProvider from "@/store/statusContext";
import MapDisplayModule from "@/components/displays/MapDisplayModule";
import CursorContextProvider from "@/store/cursorContext";
import MastermapDisplayModule from "@/components/displays/MastermapDisplayModule";
import MapCardContainer from "@/components/maps/MapCardContainer";
import MasterMapCardContainer from "@/components/mastermaps/MasterMapCardContainer";

export const metadata = {
  title: `Maps`,
};

interface titleProps {
  numberSortedTextGroup: AdminSettings[];
}

export default async function Maps() {
  const settings = await prisma.adminSettings.findMany({
    where: {
      category: "PAGE",
      subCategory: "map",
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

  const mapId = settings.find((item) => item.type === "mapId");
  const mastermapId = settings.find((item) => item.type === "mastermapId");
  const mainTextGroup = groupedContent["1"];

  // Custom sections
  const featuredMaps = settings.find((item) => item.type === "setFeaturedMaps");
  const newMaps = settings.find((item) => item.type === "setNewMaps");
  const exploreMaps = settings.find((item) => item.type === "setExploreMaps");
  const newMasterMaps = settings.find(
    (item) => item.type === "setNewMasterMaps"
  );
  const featuredMasterMaps = settings.find(
    (item) => item.type === "setFeaturedMasterMaps"
  );
  const exploreMasterMaps = settings.find(
    (item) => item.type === "setExploreMasterMaps"
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
            {/* Title */}
            <div className="col-span-8">
              <TitleSection numberSortedTextGroup={mainTextGroup} />
            </div>
            {/* Displays */}
            {mapId && (
              <div className="col-span-6" style={{ order: mapId.order }}>
                <MapDisplay mapId={mapId} />
              </div>
            )}
            {mastermapId && (
              <div className="col-span-6" style={{ order: mastermapId.order }}>
                <MasterMapDisplay masterMapId={mastermapId} />
              </div>
            )}
            {/* Maps */}
            {featuredMaps && (
              <div className="col-span-2" style={{ order: featuredMaps.order }}>
                <MapCardContainer
                  type={featuredMaps.type}
                  amount={parseInt(featuredMaps.value)}
                />
              </div>
            )}
            {newMaps && (
              <div className="col-span-2" style={{ order: newMaps.order }}>
                <MapCardContainer
                  type={newMaps.type}
                  amount={parseInt(newMaps.value)}
                />
              </div>
            )}
            {exploreMaps && (
              <div className="col-span-2" style={{ order: exploreMaps.order }}>
                <MapCardContainer
                  type={exploreMaps.type}
                  amount={parseInt(exploreMaps.value)}
                />
              </div>
            )}
            {/* Mastermaps */}
            {newMasterMaps && (
              <div
                className="col-span-2"
                style={{ order: newMasterMaps.order }}
              >
                <MasterMapCardContainer
                  type={newMasterMaps.type}
                  amount={parseInt(newMasterMaps.value)}
                />
              </div>
            )}
            {featuredMasterMaps && (
              <div
                className="col-span-2"
                style={{ order: featuredMasterMaps.order }}
              >
                <MasterMapCardContainer
                  type={featuredMasterMaps.type}
                  amount={parseInt(featuredMasterMaps.value)}
                />
              </div>
            )}
            {exploreMasterMaps && (
              <div
                className="col-span-2"
                style={{ order: exploreMasterMaps.order }}
              >
                <MasterMapCardContainer
                  type={exploreMasterMaps.type}
                  amount={parseInt(exploreMasterMaps.value)}
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

async function MapDisplay({ mapId }: { mapId: AdminSettings }) {
  const idNum = parseInt(mapId.value);
  let data: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;
  if (!mapId.value || isNaN(idNum)) {
    return <div className="text-destructive">Invalid story ID</div>;
  }

  // fetch mapdata
  try {
    data = await fetchMapData(idNum);

    if (!data.map) {
      error = "Map not found";
    }
  } catch (err) {
    error = "Failed to fetch data";
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full relative">
      <h3 className="text-xl font-semibold bg-slate-100 px-2 py-1">
        {data.map.title}
      </h3>
      <StatusContextProvider>
        <MapDisplayModule data={data} />
      </StatusContextProvider>
    </div>
  );
}

async function MasterMapDisplay({
  masterMapId,
}: {
  masterMapId: AdminSettings;
}) {
  const masterMap = await fetchMasterMap(parseInt(masterMapId.value));

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold bg-slate-100 px-2 py-1">
        {masterMap?.title}
      </h3>
      <CursorContextProvider>
        <MastermapDisplayModule masterMap={masterMap} />
      </CursorContextProvider>
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
