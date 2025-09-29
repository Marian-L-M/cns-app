import Link from "next/link";

import { Story, Status } from "@prisma/client";
import prisma from "@/../prisma/db";

import StatusFilter from "@/components/filters/StatusFilter";
import Pagination from "@/components/ui/pagination";
import { Button, buttonVariants } from "@/components/ui/button";

import DataTable from "./DataTable";
import { requireAuthorOrAdmin } from "@/lib/auth-guards";

export const metadata = {
  title: `Stories`,
};

export interface SearchParams {
  status: Status;
  page: string;
  orderBy: keyof Story;
}

export default async function StoriesOverviewPage({
  searchParams: rawSearchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await requireAuthorOrAdmin();

  const searchParams = await rawSearchParams;

  const pageSize = 10;
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
    include: {
      userStories: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
              userProfile: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="w-full flex flex-col gap-4 mt-5">
      <div
        className="flex border-b p-2 border-b-slate-200  justify-between items-center"
        id="title-row"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Wikis</h1>
          <StatusFilter />
        </div>
        <div id="actions">
          <Button asChild>
            <Link href={"/editor/stories/create"}>Create</Link>
          </Button>
        </div>
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
