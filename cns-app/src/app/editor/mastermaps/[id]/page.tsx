import MasterMapEditor from "@/components/editors/MasterMapEditor";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import CursorContextProvider from "@/store/cursorContext";
import prisma from "@/../prisma/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

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
    <div className="w-full flex flex-col gap-4" id="substory-detail-page">
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/editor">Editor</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href="/editor/mastermaps">Mastermaps</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{masterMap.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl">Edit Mastermap</h1>
      </div>
      <CursorContextProvider>
        <MasterMapEditor MasterMap={masterMap} />
      </CursorContextProvider>
    </div>
  );
}
