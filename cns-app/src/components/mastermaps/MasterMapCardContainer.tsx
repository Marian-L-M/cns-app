import prisma from "@/../prisma/db";
import { MapHierarchyMaster } from "@prisma/client";

import MasterMapCard from "./MasterMapCard";

interface Props {
  amount: number;
  type: string;
}

export default async function MasterMapCardContainer({ amount, type }: Props) {
  let masterMaps: MapHierarchyMaster[] = [];
  let title: string = "Maps";

  switch (type) {
    case "setNewMasterMaps":
      masterMaps = await prisma?.mapHierarchyMaster.findMany({
        orderBy: [{ createdAt: "desc" }],
        take: amount,
        include: {
          parentMap: true,
          childMaps: true,
          userMapHierarchies: true,
        },
      });
      title = "New Mastermaps";
      break;
    case "setFeaturedMasterMaps":
      masterMaps = await prisma?.mapHierarchyMaster.findMany({
        where: {
          featured: true,
        },
        orderBy: [{ createdAt: "desc" }],
        take: amount,
        include: {
          parentMap: true,
          childMaps: true,
          userMapHierarchies: true,
        },
      });
      title = "Featured Mastermaps";
      break;
    case "setExploreMasterMaps":
      const masterMapsCount = await prisma.mapHierarchyMaster.count();
      const skip = Math.floor(Math.random() * masterMapsCount);
      masterMaps = await prisma?.mapHierarchyMaster.findMany({
        skip: skip,
        orderBy: {
          createdAt: "desc",
        },
        take: amount,
      });
      title = "Explore Mastermaps";
      break;
  }

  return (
    <div className="w-full flex flex-col gap-4 p-4 border border-gray-200 rounded-xl self-stretch">
      <h3 className="text-xl font-semibold  bg-slate-100 px-2 py-1">{title}</h3>
      {masterMaps.map((masterMap) => (
        <MasterMapCard
          masterMap={masterMap}
          key={`mastermap-${masterMap.id}`}
        />
      ))}
    </div>
  );
}
