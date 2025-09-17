import React from "react";
import prisma from "@/../prisma/db";
import { Map } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MapSearchBar from "@/components/maps/searchbar/MapSearchBar";
import MapCardTable from "@/components/maps/MapCardTable";

export const metadata = {
  title: `Featured Maps`,
};

export interface SearchParams {
  author: string;
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
      userMaps: {},
      title: {
        contains: title,
        mode: "insensitive",
      },
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      userMaps: {
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

  let maps: Map[] = [];

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
      settings.where.userMaps = {
        some: {
          userId: authorId,
        },
      };
      maps = await prisma.map.findMany(settings);
    }
  } else {
    maps = await prisma.map.findMany(settings);
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Featured Maps</h1>
      <div className="w-full flex flex-col gap-4 border rounded-md p-4">
        <MapSearchBar authorList={authorList} />
        <Link href="/maps/featured">
          <Button>Reset</Button>
        </Link>
      </div>
      <MapCardTable maps={maps} />
    </div>
  );
}
