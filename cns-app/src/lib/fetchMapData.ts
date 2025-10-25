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
      userMaps: {
        include: {
          user: true,
        },
      },
    },
  });

  const userMaps = map?.userMaps;

  return { userMaps };
}

export async function fetchMapData(mapId: string | number) {
  const id = typeof mapId == "string" ? parseInt(mapId) : mapId;

  const map = await prisma.map.findUnique({
    where: { id: id },
  });
  const mapAreas = await prisma.globalArea.findMany({
    where: { mapId: id },
    include: {
      wiki: {
        select: {
          slug: true,
          infoboxItems: true,
        },
      },
      canvasStyles: true,
    },
  });
  const mapObjects = await prisma.globalObject.findMany({
    where: { mapId: id },
    include: {
      wiki: {
        select: {
          slug: true,
          infoboxItems: true,
        },
      },
      canvasStyles: true,
    },
  });

  return { map, mapAreas, mapObjects };
}

export async function fetchMapDataBySlug(mapSlug: string) {
  const slug = mapSlug;

  const map = await prisma.map.findFirst({
    where: { slug: slug },
  });

  if (!map) return { map: null, mapAreas: [], mapObjects: [] };

  const mapAreas = await prisma.globalArea.findMany({
    where: { mapId: map.id },
    include: {
      wiki: {
        select: {
          slug: true,
          infoboxItems: true,
        },
      },
      canvasStyles: true,
    },
  });

  const mapObjects = await prisma.globalObject.findMany({
    where: { mapId: map.id },
    include: {
      wiki: {
        select: {
          slug: true,
          infoboxItems: true,
        },
      },
      canvasStyles: true,
    },
  });

  return { map, mapAreas, mapObjects };
}

export async function fetchMasterMap(masterMapId: number) {
  const masterMap = await prisma.mapHierarchyMaster.findUnique({
    where: { id: masterMapId },
    include: {
      parentMap: true,
      childMaps: {
        include: {
          childMap: true,
          canvasStyles: true,
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
      canvasStyles: child.canvasStyles,
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
      canvasStyles: true,
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

interface MastermapFetchProps {
  selectedMastermapId: number | undefined;
  setMastermapName: React.Dispatch<React.SetStateAction<string>>;
}

export async function fetchMastermapName({
  selectedMastermapId,
  setMastermapName,
}: MastermapFetchProps) {
  if (!selectedMastermapId) {
    setMastermapName("");
    return;
  }

  try {
    const response = await axios.get(`/api/mastermaps/${selectedMastermapId}`);
    if (response.data && response.data.title) {
      setMastermapName(response.data.title);
    }
  } catch (error) {
    console.error("Error fetching mastermap data:", error);
    setMastermapName("");
  }
}
