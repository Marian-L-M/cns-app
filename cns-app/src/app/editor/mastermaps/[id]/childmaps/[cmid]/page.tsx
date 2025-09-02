import ChildMapEditor from "@/components/editors/ChildMapEditor";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import { fetchHierarchyChild, fetchMasterMap } from "@/lib/fetchMapData";
import CursorContextProvider from "@/store/cursorContext";
import prisma from "@/../prisma/db";

interface MapPageProps {
  params: { id: string; cmid: string };
}

export default async function MasterMapEditorPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const { cmid } = resolvedParams;
  const id = parseInt(resolvedParams.id);
  // const cmid = parseInt(resolvedParams.cmid);

  const childMap = await fetchHierarchyChild(cmid);
  const masterMap = await prisma?.mapHierarchyMaster.findUnique({
    where: { id },
    include: {
      parentMap: true,
      childMaps: {
        include: {
          childMap: true,
          canvasStyles: true,
        },
      },
      userMapHierarchies: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!masterMap) {
    return <div className="text-destructive">No maps found</div>;
  }

  const session = await requireOwnerOrAdmin({
    userJunction: masterMap.userMapHierarchies,
  });

  return (
    <CursorContextProvider>
      <ChildMapEditor MasterMap={masterMap} ChildMap={childMap} />
    </CursorContextProvider>
  );
}
