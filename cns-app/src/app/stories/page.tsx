import React from "react";
import prisma from "../../../prisma/db";
import DataTable from "./DataTable";

const Stories = async () => {
  const stories = await prisma.entry.findMany();
  return (
    <div>
      <DataTable entries={stories} />
    </div>
  );
};

export default Stories;
