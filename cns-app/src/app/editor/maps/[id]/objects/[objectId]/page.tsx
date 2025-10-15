import prisma from "@/../prisma/db";
import { fetchMapAuthorId } from "@/lib/fetchMapData";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import EditorContextProvider from "@/store/mapEditorContext";
import MapObjectEditorModule from "@/components/maps/MapObjectEditorModule";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface MapAreaEditorProps {
  params: Promise<{
    id: string;
    objectId: string;
  }>;
}

export default async function MapAreaEditor({ params }: MapAreaEditorProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const objectId = parseInt(resolvedParams.objectId);

  // Imperfect validation, will return false even if letters are mixed with numbers
  if (isNaN(id)) {
    return <div>Invalid map ID</div>;
  }
  if (isNaN(objectId)) {
    return <div>Invalid map object</div>;
  }

  // Check if current user has permission to edit
  const mapData = await fetchMapAuthorId(id);
  const session = await requireOwnerOrAdmin({ userJunction: mapData.userMaps });

  // Get corresponding Objects and map
  const object = await prisma.globalObject.findUnique({
    where: { id: objectId },
    include: {
      canvasStyles: true,
    },
  });

  const map = await prisma.map.findUnique({
    where: { id: id },
  });

  if (!object) {
    return <div>Object not found</div>;
  }

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
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <Link href="/editor/maps">Maps</Link>
                  </DropdownMenuItem>
                  {map && (
                    <DropdownMenuItem>
                      <Link href={`/editor/maps/${map.id}`}>{map.title}</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{object.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl">Edit Map Object</h1>
      </div>
      <EditorContextProvider>
        <MapObjectEditorModule map={map} globalObject={object} />
      </EditorContextProvider>
    </div>
  );
}
