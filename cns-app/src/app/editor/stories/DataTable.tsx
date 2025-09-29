import { ArrowDown, Check, EllipsisVertical, X } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Role, Story, UserProfile, UserStory } from "@prisma/client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StoryStatusBadge from "@/components/story/StoryStatusBadge";

import { SearchParams } from "./page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type StoryWithAuthor = Story & {
  userStories: (UserStory & {
    user: {
      id: string;
      name: string;
      role: Role;
      userProfile: UserProfile | null;
    };
  })[];
};

interface Props {
  stories: StoryWithAuthor[];
  searchParams: SearchParams;
}

export default function DataTable({ stories, searchParams }: Props) {
  const createQueryObject = (orderBy: string) => ({
    orderBy,
    ...(searchParams.status && { status: searchParams.status }),
    ...(searchParams.page && { page: searchParams.page }),
  });

  const getAuthorDisplayName = (story: StoryWithAuthor): string => {
    const owner = story.userStories.find(
      (us) => us.role === "OWNER" || us.role === "EDITOR"
    );
    if (owner?.user?.userProfile?.displayName) {
      return owner.user.userProfile.displayName;
    }
    return "Unknown";
  };

  return (
    <div className="w-full mt-5">
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">ID</TableHead>
              <TableHead>
                <Link href={{ query: createQueryObject("title") }}>Title</Link>
                {"title" === searchParams.orderBy && (
                  <ArrowDown className="inline p-1" />
                )}
              </TableHead>
              <TableHead>
                <div>
                  <Link href={{ query: createQueryObject("status") }}>
                    Status
                  </Link>
                  {"status" === searchParams.orderBy && (
                    <ArrowDown className="inline p-1" />
                  )}
                </div>
              </TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories
              ? stories.map((story) => (
                  <TableRow key={story.id}>
                    <TableCell>{story.id}</TableCell>
                    <TableCell>{story.title}</TableCell>
                    <TableCell>
                      <StoryStatusBadge status={story.status} />
                    </TableCell>
                    <TableCell>{story.featured ? <Check /> : <X />}</TableCell>
                    <TableCell>{story.category}</TableCell>
                    <TableCell>{story.storyTime}</TableCell>
                    <TableCell>{getAuthorDisplayName(story)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Link
                              href={`/stories/${story.id}`}
                              className="w-max flex-1"
                            >
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link
                              href={`/editor/stories/${story.id}`}
                              className="w-max flex-1"
                            >
                              Edit
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
