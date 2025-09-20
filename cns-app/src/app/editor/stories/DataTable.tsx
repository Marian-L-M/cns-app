import { ArrowDown } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Story } from "@prisma/client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StoryRating from "@/components/story/StoryRating";
import StoryStatusBadge from "@/components/story/StoryStatusBadge";
import { buttonVariants } from "@/components/ui/button";

import { SearchParams } from "./page";

interface Props {
  stories: Story[];
  searchParams: SearchParams;
}

export default function DataTable({ stories, searchParams }: Props) {
  // Create simple query objects to avoid serialization errors
  const createQueryObject = (orderBy: string) => ({
    orderBy,
    ...(searchParams.status && { status: searchParams.status }),
    ...(searchParams.page && { page: searchParams.page }),
  });

  return (
    <div className="w-full mt-5">
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Link href={{ query: createQueryObject("title") }}>Title</Link>
                {"title" === searchParams.orderBy && (
                  <ArrowDown className="inline p-1" />
                )}
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <div className="flex justify-center">
                  <Link href={{ query: createQueryObject("status") }}>
                    Status
                  </Link>
                  {"status" === searchParams.orderBy && (
                    <ArrowDown className="inline p-1" />
                  )}
                </div>
              </TableHead>
              {/* <TableHead>
                <div className="flex justify-center">
                  <Link href={{ query: createQueryObject("rating") }}>
                    Rating
                  </Link>
                  {"rating" === searchParams.orderBy && (
                    <ArrowDown className="inline p-1" />
                  )}
                </div>
              </TableHead> */}
              <TableHead>
                <Link href={{ query: createQueryObject("createdAt") }}>
                  Created At
                </Link>
                {"createdAt" === searchParams.orderBy && (
                  <ArrowDown className="inline p-1" />
                )}
              </TableHead>
              <TableHead>
                {" "}
                <Link href={{ query: createQueryObject("updatedAt") }}>
                  Updated At
                </Link>
                {"updatedAt" === searchParams.orderBy && (
                  <ArrowDown className="inline p-1" />
                )}
              </TableHead>
              <TableHead>...</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories
              ? stories.map((story) => (
                  <TableRow key={story.id} data-href="/">
                    <TableCell>
                      <Link href={`/stories/${story.id}`}>{story.title}</Link>
                    </TableCell>
                    <TableCell>{story.description}</TableCell>
                    <TableCell>{story.category}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <StoryStatusBadge status={story.status} />
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex justify-center">
                        <StoryRating rating={story.rating} />
                      </div>
                    </TableCell> */}
                    <TableCell>
                      {story.createdAt.toLocaleDateString("ja-JP", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      {story.updatedAt.toLocaleDateString("ja-JP", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/editor/stories/${story.id}`}
                        className={buttonVariants({ variant: "outline" })}
                      >
                        Edit
                      </Link>
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
