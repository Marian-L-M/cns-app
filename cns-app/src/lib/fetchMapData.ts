// Move to utils folder and polish concept
import axios from "axios";
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
  const masterMap = await prisma.mapHierarchyMaster.findUnique({
    where: { id: parseInt(masterMapId) },
    include: {
      parentMap: true,
      childMaps: {
        include: {
          childMap: true,
        },
      },
    },
  });

  if (!masterMap) return null;

  return {
    ...masterMap,
    childMaps: masterMap.childMaps.map((child) => ({
      ...child.childMap,
      x: child.x,
      y: child.y,
      wx: child.wx,
      wy: child.wy,
    })),
  };
};

interface MapFetchProps {
  selectedMapId: number | undefined;
  setMapName: React.Dispatch<React.SetStateAction<string>>;
}

export async function fetchMapName({
  selectedMapId,
  setMapName,
}: MapFetchProps) {
  if (!selectedMapId) {
    setMapName("");
    return;
  }

  try {
    const response = await axios.get(`/api/maps/${selectedMapId}`);
    if (response.data && response.data.title) {
      setMapName(response.data.title);
    }
  } catch (error) {
    console.error("Error fetching map data:", error);
    setMapName("");
  }
}
