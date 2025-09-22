import ChildMapEditor from "@/components/editors/ChildMapEditor";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import CursorContextProvider from "@/store/cursorContext";
import prisma from "@/../prisma/db";

interface MapPageProps {
  params: Promise<{ id: string; cmid: string }>;
}

export default async function MasterMapEditorPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const cmid = parseInt(resolvedParams.cmid);

  const masterMap = await prisma?.mapHierarchyMaster.findUnique({
    where: { id },
    include: {
      parentMap: true,
      childMaps: {
        where: { id: cmid },
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
      <ChildMapEditor MasterMap={masterMap} ChildMap={masterMap.childMaps[0]} />
    </CursorContextProvider>
  );
}
