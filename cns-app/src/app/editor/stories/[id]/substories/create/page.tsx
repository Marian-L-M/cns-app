import StoryEditor from "@/components/editors/StoryEditor";
import prisma from "@/../prisma/db";
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
import { Ellipsis } from "lucide-react";

interface SubstoryProps {
  params: Promise<{
    id: string;
    sid: string;
  }>;
}

export default async function SubStoryDetailPage({ params }: SubstoryProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

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

  if (!story) {
    return <div>Story not found</div>;
  }
  if (!story.assignedToMapID) {
    return <div>No associated map</div>;
  }

  // fetch map
  const map = await prisma.map.findUnique({
    where: { id: story.assignedToMapID },
  });

  if (!map) {
    return <div>Map not found</div>;
  }

  // Check if current user has permission to edit current story
  const session = await requireOwnerOrAdmin({
    userJunction: story.userStories,
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
              <BreadcrumbPage>Create substory</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl">Create Substory</h1>
      </div>
      <StoryEditor story={story} map={map} />
    </div>
  );
}
