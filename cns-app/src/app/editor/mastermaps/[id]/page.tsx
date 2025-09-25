import MasterMapEditor from "@/components/editors/MasterMapEditor";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import CursorContextProvider from "@/store/cursorContext";
import prisma from "@/../prisma/db";

interface MapPageProps {
  params: Promise<{ id: string }>;
}

export default async function MasterMapEditorPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

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
    return <div className="text-destructive">No Mastermaps found</div>;
  }

  const session = await requireOwnerOrAdmin({
    userJunction: masterMap.userMapHierarchies,
  });

  return (
    <CursorContextProvider>
      <MasterMapEditor MasterMap={masterMap} />
    </CursorContextProvider>
  );
}
