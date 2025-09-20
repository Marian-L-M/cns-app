import React from "react";
import prisma from "@/../prisma/db";
import WikiSearchBar from "@/components/wiki/searchbar/WikiSearchBar";
import StoryCardTable from "../StoyCardTable";
import { Status, Story } from "@prisma/client";
import StorySearchBar from "@/components/story/searchbar/StorySearchBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Featured Stories`,
};

export interface SearchParams {
  author: string;
  status: string;
  page: string;
  title: string;
  orderBy: Date;
}

export default async function featuredStoryPage({
  searchParams: rawSearchParams,
}: {
  searchParams: SearchParams;
}) {
  const searchParams = await Promise.resolve(rawSearchParams);

  const pageSize = 12;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const orderBy = searchParams.orderBy ? searchParams.orderBy : "createdAt";
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
      featured: true,
      ...(status && { status: status as Status }),
      userStories: {},
      title: {
        contains: title,
        mode: "insensitive",
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
          mode: "insensitive",
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
      <h1 className="text-2xl font-bold">Featured Stories</h1>
      <div className="w-full flex flex-col gap-4 border rounded-md p-4">
        <StorySearchBar authorList={authorList} />
        <Link href="/stories/featured">
          <Button>Reset</Button>
        </Link>
      </div>
      <StoryCardTable stories={stories} />
    </div>
  );
}
