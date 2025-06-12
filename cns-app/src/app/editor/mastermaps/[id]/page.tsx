import MasterMapEditor from "@/components/editors/MasterMapEditor";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import { fetchMasterMap } from "@/lib/fetchMapData";
import CursorContextProvider from "@/store/cursorContext";

interface MapPageProps {
  params: { id: string };
}

export default async function MasterMapEditorPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const masterMap = await fetchMasterMap(id);
  const session = await requireOwnerOrAdmin({ authors: masterMap?.authors });

  if (!masterMap) {
    return <div className="text-destructive">No Mastermaps found</div>;
  }

  return (
    <CursorContextProvider>
      <MasterMapEditor MasterMap={masterMap} user={session.user} />
    </CursorContextProvider>
  );
}
