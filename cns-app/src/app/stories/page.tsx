import React from "react";
import prisma from "../../../prisma/db";
import DataTable from "./DataTable";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Pagination from "@/components/Pagination";

const Stories = async () => {
  const stories = await prisma.entry.findMany();
  return (
    <div>
      <Link
        href="/stories/new"
        className={buttonVariants({ variant: "default" })}
      >
        New Story Entry
      </Link>
      <DataTable entries={stories} />
      <Pagination itemCount={7} pageSize={2} currentPage={2} />
    </div>
  );
};

export default Stories;
