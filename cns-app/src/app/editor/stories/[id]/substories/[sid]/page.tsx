import prisma from "@/../prisma/db";
import EditorContextProvider from "@/store/mapEditorContext";
import StoryEditor from "@/components/editors/StoryEditor";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
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

interface substoryProps {
  params: Promise<{
    id: string;
    sid: string;
  }>;
}

export default async function SubStoryDetailPage({ params }: substoryProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const sid = parseInt(resolvedParams.sid);

  const story = await prisma.story.findUnique({
    where: { id: id },
    include: {
      userStories: {
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

  const substory = await prisma.subStory.findUnique({
    where: { id: sid },
    include: {
      canvasStyles: true,
    },
  });

  if (!story) {
    return <div>Story not found</div>;
  }

  // Check if current user has permission to edit current story
  const session = await requireOwnerOrAdmin({
    userJunction: story.userStories,
  });

  if (!story.assignedToMapID) {
    return <div>No associated map</div>;
  }
  if (!substory) {
    return <div>Substory not found</div>;
  }

  // fetch map
  const map = await prisma.map.findUnique({
    where: { id: story.assignedToMapID },
  });

  if (!map) {
    return <div>Map not found</div>;
  }

  // Dirty fix for bad DB schema
  const subStoryData = {
    ...substory,
    nodes: substory.nodes as StoryNode[],
  };

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
                    <Link href="/editor/stories">Stories</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/editor/stories/${story.id}`}>
                      {story.title}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{subStoryData.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl">Edit Substory</h1>
      </div>
      <EditorContextProvider>
        <StoryEditor story={story} substory={subStoryData} map={map} />
      </EditorContextProvider>
    </div>
  );
}
