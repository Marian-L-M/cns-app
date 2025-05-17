import { notFound } from "next/navigation";
import prisma from "@/../prisma/db";
import EditMapClient from "./client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AreaOverviewModule from "./AreaOverview";

interface Props {
  params: { id: string };
}

export default async function EditMapPage({ params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const map = await prisma.map.findUnique({
    where: { id: id },
  });

  if (!map) {
    return notFound();
  }

  const serializedMap = JSON.parse(JSON.stringify(map));

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl">Edit Map</h1>
      <Tabs defaultValue="areas" className="w-full">
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="areas">Areas</TabsTrigger>
          <TabsTrigger value="objects">Objects</TabsTrigger>
        </TabsList>
        <TabsContent value="setup">
          <EditMapClient map={serializedMap} />
        </TabsContent>
        <TabsContent value="areas">
          <AreaOverviewModule mapId={id} />
        </TabsContent>
        <TabsContent value="objects">Object overview here</TabsContent>
      </Tabs>
    </div>
  );
}
