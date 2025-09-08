import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { Wiki, WikiType } from "@prisma/client";

import prisma from "@/../prisma/db";
import Image from "next/image";
import { truncateText } from "@/lib/textUtils";
import WikiFilter from "../WikiFilter";
import TypeFilter from "../TypeFilter";
import { Button } from "@/components/ui/button";
import SearchInput from "../SearchInput";

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
      RelatedUser: true,
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
              RelatedUser: true,
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

  // 20250908 To do: dropdown labels do not update on reset

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Featured Wikis</h1>
      <div className="w-full flex flex-col gap-4 border rounded-md p-4">
        <div className="flex gap-4 items-center">
          <WikiFilter authors={authorList} />
          <TypeFilter />
          <SearchInput />
        </div>
        <Link href="/wiki/featured">
          <Button>Reset</Button>
        </Link>
      </div>
      <div className="rounded-md grid grid-cols-12 gap-4 border  p-4">
        {wikis &&
          wikis.map((wiki) => (
            <div
              className="col-span-2 flex flex-col justify-between gap-2 rounded-xl overflow-hidden border border-gray-200  "
              key={`wiki-${wiki.id}`}
            >
              <div className="img-container relative w-full h-36">
                <Link href={`/wiki/${wiki.id}`}>
                  {wiki.thumbUrl ? (
                    <Image
                      src={wiki.thumbUrl}
                      alt="featured wiki"
                      fill={true}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Image
                      src={"/wiki/placeholder-2.jpg"}
                      alt="featured wiki placeholder"
                      fill={true}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </Link>
              </div>
              <div className="mb-auto flex flex-col gap-1 p-4 m-2">
                <h4 className="text-lg font-semibold">{wiki.title}</h4>
                <p className="text-sm">
                  {truncateText({ text: wiki.description, limit: 80 })}
                </p>
              </div>
              <Link
                href={`/wiki/${wiki.id}`}
                className=" self-end flex gap-1 py-1 px-2 rounded-md border border-gray-100 hover:opacity-70 m-2"
              >
                View More <ChevronRight />
              </Link>
            </div>
          ))}
        {wikis.length == 0 && <h2>No wikis found</h2>}
      </div>
    </div>
  );
}
