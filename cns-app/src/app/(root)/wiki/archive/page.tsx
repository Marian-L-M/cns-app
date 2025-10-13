import React from "react";
import { Prisma, Wiki, WikiType } from "@prisma/client";
import prisma from "@/../prisma/db";
import WikiSearchBar from "@/components/wiki/searchbar/WikiSearchBar";
import WikiTable from "../WikiTable";
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
  title: `Wiki Archive`,
};

export interface SearchParams {
  author: string;
  type: string;
  page: string;
  title: string;
  orderBy: keyof Wiki;
}

export default async function wikiArchivePage({
  searchParams: rawSearchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await rawSearchParams;

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
      ...(type && { type: type as WikiType }),
      userWikis: {},
      title: {
        contains: title,
        mode: Prisma.QueryMode.insensitive,
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
          mode: Prisma.QueryMode.insensitive,
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
      <div className="flex-col gap-2">
        <h1 className="text-2xl font-bold">Wiki Archive</h1>
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/wiki">Wikis</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Archive</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="w-full flex flex-col gap-4 border rounded-md p-4">
        <WikiSearchBar authorList={authorList} />
        <Link href="/wiki/archive">
          <Button>Reset</Button>
        </Link>
      </div>
      <WikiTable wikis={wikis} />
    </div>
  );
}
