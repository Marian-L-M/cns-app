import React from "react";
import prisma from "../../../prisma/db";
import DataTable from "./DataTable";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import StatusFilter from "@/components/filters/StatusFilter";
import { Entry, Status } from "@prisma/client";

export interface SearchParams {
  status: Status;
  page: string;
  orderBy: keyof Entry;
}

const Stories = async ({ searchParams }: { searchParams: SearchParams }) => {
  const pageSize = 2;
  const page = parseInt(searchParams.page) || 1;

  const orderBy = searchParams.orderBy ? searchParams.orderBy : "createdAt";

  const statuses = Object.values(Status);

  // Check statuses and set to searchParams.status if it is valid
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
  const itemCount = await prisma.entry.count({ where });
  const stories = await prisma.entry.findMany({
    where,
    orderBy: {
      [orderBy]: "desc",
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return (
    <div>
      <div className="flex gap-2">
        <Link
          href="/stories/new"
          className={buttonVariants({ variant: "default" })}
        >
          New Story Entry
        </Link>
        <StatusFilter />
      </div>
      <DataTable entries={stories} searchParams={searchParams} />
      <Pagination
        itemCount={itemCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  );
};

export default Stories;
