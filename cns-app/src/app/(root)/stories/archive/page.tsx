import React from "react";
import prisma from "@/../prisma/db";
import StoryCardTable from "../../../../components/story/StoyCardTable";
import { Prisma, Status, Story } from "@prisma/client";
import StorySearchBar from "@/components/story/searchbar/StorySearchBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata = {
  title: `Stories Archive`,
};

export interface SearchParams {
  author: string;
  status: string;
  page: string;
  title: string;
  orderBy: Date;
}

export default async function storyArchivePage({
  searchParams: rawSearchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await rawSearchParams;

  const pageSize = 12;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const title = searchParams.title ? searchParams.title : "";
  const authorName = searchParams.author ? searchParams.author : undefined;
  const status = searchParams.status ? searchParams.status : undefined;

  const authorList = await prisma.user.findMany({
    where: {
      role: "AUTHOR",
    },
    select: {
      id: true,
      userProfile: true,
    },
  });

  const settings = {
    where: {
      ...(status && { status: status as Status }),
      userStories: {},
      title: {
        contains: title,
        mode: Prisma.QueryMode.insensitive,
      },
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      userStories: {
        include: {
          user: {
            select: {
              id: true,
              role: true,
              userProfile: true,
            },
          },
        },
      },
    },
  };

  let stories: Story[] = [];

  if (authorName) {
    const author = await prisma.userProfile.findFirst({
      where: {
        displayName: {
          equals: authorName,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    });
    if (author) {
      const authorId = author.userId;
      settings.where.userStories = {
        some: {
          userId: authorId,
        },
      };
      stories = await prisma.story.findMany(settings);
    }
  } else {
    stories = await prisma.story.findMany(settings);
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/stories">Stories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Featured</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="w-full flex flex-col gap-4 border rounded-md p-4">
        <h1 className="text-2xl font-bold">Story archive</h1>
        <StorySearchBar authorList={authorList} />
        <Link href="/stories/archive">
          <Button>Reset</Button>
        </Link>
      </div>
      <StoryCardTable stories={stories} />
    </div>
  );
}
