import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Status, Wiki, WikiType } from "@prisma/client";

import prisma from "@/../prisma/db";
import Image from "next/image";
import { truncateText } from "@/lib/textUtils";
import WikiFilter from "../WikiFilter";
import TypeFilter from "../TypeFilter";

// import { SearchParams } from "./page";

export const metadata = {
  title: `Featured Wikis`,
};

export interface SearchParams {
  author: string;
  type: string;
  page: string;
  orderBy: keyof Wiki;
}

interface Props {
  wikis: Wiki[];
  searchParams: SearchParams;
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
  const author = searchParams.author ? searchParams.author : undefined;
  const type: WikiType = searchParams.type ? searchParams.type : undefined;

  const wikis = await prisma.wiki.findMany({
    where: {
      featured: true,
      type: type,
    },
    orderBy: {
      [orderBy]: "desc",
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      authors: {
        select: {
          id: true,
          RelatedUser: true,
        },
      },
    },
  });

  // Flatten authors
  const featuredAuthors = wikis
    .flatMap((wiki) => wiki.authors)
    .filter((author) => author.RelatedUser !== null)
    .filter(
      (author, index, array) =>
        array.findIndex((a) => a.id === author.id) === index
    );

  const filteredWikis = author
    ? wikis.filter((wiki) =>
        wiki.authors.some(
          (wikiAuthor) =>
            wikiAuthor.RelatedUser?.displayName?.toLowerCase() ===
            author.toLowerCase()
        )
      )
    : wikis;

  // For reordering -> delete?
  //   const createQueryObject = (orderBy: string) => ({
  //     orderBy,
  //     ...(searchParams.author && { author: searchParams.author }),
  //     ...(searchParams.page && { page: searchParams.page }),
  //   });

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Featured Wikis</h1>
      <div className="w-full flex flex-col gap-4 border rounded-md p-4">
        <WikiFilter authors={featuredAuthors} />
        <TypeFilter />
      </div>
      <div className="rounded-md grid grid-cols-12 gap-4 border  p-4">
        {filteredWikis ? (
          filteredWikis.map((wiki) => (
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
          ))
        ) : (
          <h1>No featured wikis</h1>
        )}
      </div>
    </div>
  );
}
