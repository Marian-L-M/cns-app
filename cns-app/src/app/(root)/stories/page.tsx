import Link from "next/link";

import { Story, Status } from "@prisma/client";
import prisma from "@/../prisma/db";

import StatusFilter from "@/components/filters/StatusFilter";
import Pagination from "@/components/ui/pagination";
import { buttonVariants } from "@/components/ui/button";

import DataTable from "./DataTable";

export const metadata = {
  title: `Stories`,
};

export interface SearchParams {
  status: Status;
  page: string;
  orderBy: keyof Story;
}

export default async function Stories({
  searchParams: rawSearchParams,
}: {
  searchParams: SearchParams;
}) {
  // Create a fully resolved object rather than the promise that contains it.
  const searchParams = await Promise.resolve(rawSearchParams);

  const pageSize = 2;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const orderBy = searchParams.orderBy ? searchParams.orderBy : "createdAt";
  const statuses = Object.values(Status);

  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  let where = {};

  if (status) {
    where = {
      status,
    };
  } else {
    where = {
      NOT: [{ status: "COMPLETED" as Status }],
    };
  }
  const itemCount = await prisma.story.count({ where });
  const stories = await prisma.story.findMany({
    where,
    orderBy: {
      [orderBy]: "desc",
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return (
    <div className="w-full h-full bg-white">
      <div className="flex gap-2">
        <StatusFilter />
      </div>
      <DataTable stories={stories} searchParams={searchParams} />
      <Pagination
        itemCount={itemCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  );
}
