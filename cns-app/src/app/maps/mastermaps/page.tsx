import prisma from "../../../../prisma/db";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

async function MasterMapPage() {
  const masterMaps = await prisma.masterMap.findMany({
    include: {
      mapChildren: true,
      mapParent: true,
    },
  });

  return (
    <div className="w-full mt-5">
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">Parent</TableHead>
              <TableHead className="font-medium">Children</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {masterMaps.map((map) => (
              <TableRow key={map.id} data-href="/">
                <TableCell>
                  <Link href={`/`}>{map.title}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/maps/${map.parentMapID}`}>
                    {map.mapParent?.title || map.parentMapID}
                  </Link>
                </TableCell>
                <TableCell>
                  {map.mapChildren.length > 0
                    ? map.mapChildren.map((child) => child.id).join(", ")
                    : "No children"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default MasterMapPage;
