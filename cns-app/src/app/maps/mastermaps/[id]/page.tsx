import MasterMapModule from "@/components/maps/MasterMapModule";
import { fetchMasterMap } from "@/lib/fetchMapData";
import CursorContextProvider from "@/store/cursorContext";

interface MapPageProps {
  params: { id: string };
}

const MasterMapPage = async ({ params }: MapPageProps) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const masterMap = await fetchMasterMap(id);

  if (!masterMap) {
    return <div className="text-destructive">No maps found</div>;
  }

  return (
    <CursorContextProvider>
      <MasterMapModule masterMap={masterMap} />
    </CursorContextProvider>
  );
};

export default MasterMapPage;
