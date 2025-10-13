import EditorContextProvider from "@/store/mapEditorContext";
import { fetchMapAuthorId, fetchMapData } from "@/lib/fetchMapData";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import MapAreaEditorModule from "@/components/maps/MapAreaEditorModule";
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
  }>;
}

export default async function NewMapAreaEditor({ params }: MapAreaEditorProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return <div>Invalid map ID</div>;
  }

  // Check if current user has permission to edit
  const mapData = await fetchMapAuthorId(id);
  const session = await requireOwnerOrAdmin({ userJunction: mapData.userMaps });

  const { map } = await fetchMapData(id);

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
              <BreadcrumbPage>Create Map Area</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl">Create Map Area</h1>
      </div>
      <EditorContextProvider>
        <MapAreaEditorModule map={map} />
      </EditorContextProvider>
    </div>
  );
}
