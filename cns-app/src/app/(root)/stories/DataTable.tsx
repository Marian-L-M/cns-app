import Link from "next/link";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StoryStatusBadge from "@/components/story/StoryStatusBadge";
import { Button } from "@/components/ui/button";
import prisma from "@/../prisma/db";

interface Props {
  take: number;
  searchParams?: any;
}

export default async function DataTable({ take, searchParams }: Props) {
  const stories = await prisma?.story.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: take,
  });

  return (
    <div className="w-full">
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Updated</TableHead>
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
                    <TableCell>{story.category}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <StoryStatusBadge status={story.status} />
                      </div>
                    </TableCell>
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
                      <Button
                        variant={"outline"}
                        className="text-xs px-4 py-2"
                        asChild
                      >
                        <Link href={`/stories/${story.id}`}>View</Link>
                      </Button>
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
