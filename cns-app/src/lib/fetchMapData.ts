import prisma from "../../prisma/db";

export const fetchMapData = async (mapId: string) => {
  const map = await prisma.map.findUnique({
    where: { id: parseInt(mapId) },
  });
  const mapAreas = await prisma.globalArea.findMany({
    where: { mapId: parseInt(mapId) },
  });
  const mapObjects = await prisma.globalObject.findMany({
    where: { mapId: parseInt(mapId) },
  });

  return { map, mapAreas, mapObjects };
};
