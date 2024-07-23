import React from "react";
import prisma from "../../../prisma/db";
import DataTable from "./DataTable";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Pagination from "@/components/Pagination";

interface SearchParams {
  page: string;
}

const Stories = async ({ searchParams }: { SearchParams: SearchParams }) => {
  const pageSize = 2;
  const page = parseInt(searchParams.page) || 1;
  const itemCount = await prisma.entry.count();

  const stories = await prisma.entry.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return (
    <div>
      <Link
        href="/stories/new"
        className={buttonVariants({ variant: "default" })}
      >
        New Story Entry
      </Link>
      <DataTable entries={stories} />
      <Pagination
        itemCount={itemCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  );
};

export default Stories;
