import { notFound } from "next/navigation";
import prisma from "@/../prisma/db";

import MapForm from "@/components/forms/MapForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import AreaObjectOverviewModule from "./AreaObjectOverview";

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

  // Set active tab
  const activeTab =
    typeof modal === "string" && VALID_TABS.includes(modal) ? modal : "setup";

  // Get map objects with authors
  const map = await prisma.map.findUnique({
    where: { id: id },
    include: {
      authors: true,
    },
  });

  if (!map) {
    return notFound();
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
          <MapForm map={map} user={session.user} />
        </TabsContent>
        <TabsContent value="areas">
          <AreaObjectOverviewModule
            settings={{ mapId: id, label: "Areas", type: "areas" }}
          />
        </TabsContent>
        <TabsContent value="objects">
          <AreaObjectOverviewModule
            settings={{ mapId: id, label: "Objects", type: "objects" }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
