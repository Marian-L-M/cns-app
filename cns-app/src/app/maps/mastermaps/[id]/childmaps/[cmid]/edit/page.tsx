import MasterMapEditor from "@/components/editors/MasterMapEditor";
import CursorContextProvider from "@/store/cursorContext";
import { fetchChildMap, fetchMasterMap } from "@/lib/fetchMapData";
import ChildMapEditor from "@/components/editors/ChildMapEditor";
import { MapHierarchyChild } from "@prisma/client";

interface MapPageProps {
  params: { id: string; cmid: string };
}

async function MasterMapEditorPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const { id, cmid } = resolvedParams;

  const masterMap = await fetchMasterMap(id);
  const childMap = await fetchChildMap(cmid);

  console.log(childMap);

  if (!masterMap || !childMap) {
    return <div className="text-destructive">No map found</div>;
  }

  //  To do 250327 need to fetch instead of extract from parent because the generated map with rectangular area is stupid
  // Inefficient fetching -> fix
  // const childMap: MapHierarchyChild = masterMap.childMaps.find(
  //   (map) => map.id === parseInt(cmid)
  // );

  // if (!childMap) {
  //   return <div className="text-destructive">No child map found</div>;
  // }

  return (
    <CursorContextProvider>
      <ChildMapEditor MasterMap={masterMap} ChildMap={childMap} />
    </CursorContextProvider>
  );
}

export default MasterMapEditorPage;
