import React from "react";
import prisma from "../../../prisma/db";
import DataTable from "./DataTable";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

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
    </div>
  );
};

export default Stories;
