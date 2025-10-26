import React from "react";
import prisma from "@/../prisma/db";
import Image from "next/image";
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
  title: `Authors`,
};

export interface SearchParams {
  author: string;
  page: string;
  title: string;
  orderBy: Date;
}

export default async function authorArchivePage() {
  const authorList = await prisma.user.findMany({
    where: {
      role: "AUTHOR",
    },
    select: {
      id: true,
      userProfile: true,
    },
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Authors</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex flex-col gap-4 border rounded-md p-4">
        <h1 className="text-2xl font-bold">Authors</h1>
        <div className="w-full  grid grid-cols-5 gap-4">
          {authorList.map((author) => (
            <div
              className="w-full flex flex-col items-center gap-2 rounded-xl p-4 overflow-hidden border border-gray-200  "
              key={`author-${author.userProfile?.slug}`}
            >
              <Image
                className="rounded-full"
                src={author.userProfile?.thumbnail || "/author/placeholder.png"}
                alt={author.userProfile?.displayName || "author"}
                width={180}
                height={180}
              />
              <h3 className="font-semibold">
                {author.userProfile?.displayName}
              </h3>
              <p className="text-sm">{author.userProfile?.profileCatch}</p>
              <Button variant={"outline"} className="text-sm" asChild>
                <Link href={`/authors/${author.userProfile?.slug}`}>
                  Profile
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
