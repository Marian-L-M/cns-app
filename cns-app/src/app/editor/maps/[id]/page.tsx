import { notFound } from "next/navigation";
import prisma from "@/../prisma/db";

import MapForm from "@/components/forms/MapForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import AreaObjectOverviewModule from "./AreaObjectOverview";
import MapDisplayModule from "@/components/displays/MapDisplayModule";
import { fetchMapData } from "@/lib/fetchMapData";
import StatusContextProvider from "@/store/statusContext";

interface Props {
  params: { id: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const VALID_TABS = ["setup", "areas", "objects"];

export default async function EditMapPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const id = parseInt(resolvedParams.id);
  const modal = resolvedSearchParams.modal;

  let data: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;

  // Set active tab
  const activeTab =
    typeof modal === "string" && VALID_TABS.includes(modal) ? modal : "setup";

  // Get map objects with authors
  const map = await prisma.map.findUnique({
    where: { id: id },
    include: {
      authors: true,
      canvasStyles: true,
    },
  });

  if (!map) {
    return notFound();
  }

  try {
    data = await fetchMapData(id);

    if (!data.map) {
      error = "Map not found";
    }
  } catch (err) {
    error = "Failed to fetch data";
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  // Check if current user has permission to edit
  const session = await requireOwnerOrAdmin({ authors: map.authors });

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl">Edit Map</h1>
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="areas">Areas</TabsTrigger>
          <TabsTrigger value="objects">Objects</TabsTrigger>
        </TabsList>
        <TabsContent value="setup">
          <div className="flex flex-wrap gap-4">
            <div className="w-4xl max-w-full flex-1">
              <StatusContextProvider>
                <MapDisplayModule data={data} />
              </StatusContextProvider>
            </div>
            <div className="w-sm max-w-full flex-1">
              <MapForm map={map} user={session.user} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="areas">
          <AreaObjectOverviewModule
            settings={{ mapId: id, label: "Areas", type: "areas" }}
            data={data}
          />
        </TabsContent>
        <TabsContent value="objects">
          <AreaObjectOverviewModule
            settings={{ mapId: id, label: "Objects", type: "objects" }}
            data={data}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
