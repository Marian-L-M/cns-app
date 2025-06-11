// Move to utils folder and polish concept
import axios from "axios";
import prisma from "@/../prisma/db";

interface MapFetchProps {
  selectedMapId: number | undefined;
  setMapName: React.Dispatch<React.SetStateAction<string>>;
}

export async function fetchMapAuthorId(mapId: string | number) {
  const id = typeof mapId == "string" ? parseInt(mapId) : mapId;

  const map = await prisma.map.findUnique({
    where: { id: id },
    include: {
      authors: true,
    },
  });

  const authors = map?.authors;

  return { authors };
}

export async function fetchMapData(mapId: string | number) {
  const id = typeof mapId == "string" ? parseInt(mapId) : mapId;

  const map = await prisma.map.findUnique({
    where: { id: id },
  });
  const mapAreas = await prisma.globalArea.findMany({
    where: { mapId: id },
  });
  const mapObjects = await prisma.globalObject.findMany({
    where: { mapId: id },
  });

  return { map, mapAreas, mapObjects };
}

export async function fetchMasterMap(masterMapId: string) {
  const masterMap = await prisma.mapHierarchyMaster.findUnique({
    where: { id: parseInt(masterMapId) },
    include: {
      authors: true,
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
      hierarchyChildId: child.id,
      hierarchyParentId: child.hierarchyId,
      x: child.x,
      y: child.y,
      wx: child.wx,
      wy: child.wy,
    })),
  };
}

export async function fetchMasterMapChildren(masterMapId: string) {
  const childMaps = await prisma.mapHierarchyChild.findMany({
    where: { hierarchyId: parseInt(masterMapId) },
    include: {
      childMap: true,
    },
  });

  if (!childMaps) return null;

  return {
    childMaps,
  };
}

export async function fetchHierarchyChild(childMapId: string) {
  const hierarchyChild = await prisma.mapHierarchyChild.findUnique({
    where: { id: parseInt(childMapId) },
    include: {
      childMap: true,
    },
  });

  if (!hierarchyChild) return null;

  return {
    ...hierarchyChild,
    mapTitle: hierarchyChild.childMap.title,
    mapDescriptopn: hierarchyChild.childMap.description,
    mapImage: hierarchyChild.childMap.mapUrl,
    mapThumb: hierarchyChild.childMap.imageUrl,
  };
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
