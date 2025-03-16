// Move to utils folder and polish concept
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

export const fetchMasterMap = async (masterMapId: string) => {
  const masterMap = await prisma.masterMap.findUnique({
    where: { id: parseInt(masterMapId) },
    include: {
      mapChildren: true,
      mapParent: true,
    },
  });

  return masterMap;
};
