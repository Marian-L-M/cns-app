import prisma from "@/../prisma/db";
import { Map } from "@prisma/client";
import MapCard from "./MapCard";

interface Props {
  amount: number;
  type: string;
}

export default async function MapCardContainer({ amount, type }: Props) {
  let maps: Map[] = [];
  let title: string = "Maps";

  switch (type) {
    case "setNewMaps":
      maps = await prisma?.map.findMany({
        orderBy: [{ createdAt: "desc" }],
        take: amount,
      });
      title = "New Maps";
      break;
    case "setFeaturedMaps":
      maps = await prisma?.map.findMany({
        where: {
          featured: true,
        },
        orderBy: [{ createdAt: "desc" }],
        take: amount,
      });
      title = "Featured";
      break;
    case "setExploreMaps":
      const mapsCount = await prisma.map.count();
      const skip = Math.floor(Math.random() * mapsCount);
      maps = await prisma?.map.findMany({
        skip: skip,
        orderBy: {
          createdAt: "desc",
        },
        take: amount,
      });
      title = "Explore Maps";
      break;
  }

  return (
    <div className="w-full flex flex-col gap-4 p-4 border border-gray-200 rounded-xl self-stretch">
      <h3 className="text-xl font-semibold  bg-slate-100 px-2 py-1">{title}</h3>
      {maps.map((map) => (
        <MapCard map={map} key={`featured-article-${map.id}`} />
      ))}
    </div>
  );
}
