import React from "react";
import { Wiki, WikiType } from "@prisma/client";
import prisma from "@/../prisma/db";
import WikiSearchBar from "@/components/wiki/searchbar/WikiSearchBar";
import WikiTable from "../WikiTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Featured Wikis`,
};

export interface SearchParams {
  author: string;
  type: string;
  page: string;
  title: string;
  orderBy: keyof Wiki;
}

export default async function featuredWikiPage({
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
  const type = searchParams.type ? searchParams.type : undefined;

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
      ...(type && { type: type as WikiType }),
      userWikis: {},
      title: {
        contains: title,
        mode: "insensitive",
      },
    },
    orderBy: {
      [orderBy]: "desc",
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      userWikis: {
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

  let wikis: Wiki[] = [];

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
      settings.where.userWikis = {
        some: {
          userId: authorId,
        },
      };
      wikis = await prisma.wiki.findMany(settings);
    }
  } else {
    wikis = await prisma.wiki.findMany(settings);
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Featured Wikis</h1>
      <div className="w-full flex flex-col gap-4 border rounded-md p-4">
        <WikiSearchBar authorList={authorList} />

        <Link href="/wiki/featured">
          <Button>Reset</Button>
        </Link>
      </div>
      <WikiTable wikis={wikis} />
    </div>
  );
}
