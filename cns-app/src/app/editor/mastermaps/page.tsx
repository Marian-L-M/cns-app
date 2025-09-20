import Link from "next/link";
import { SessionProvider } from "next-auth/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/../prisma/db";
import { Button } from "@/components/ui/button";
import { requireAuthorOrAdmin } from "@/lib/auth-guards";

export default async function MasterMapPage() {
  const masterMaps = await prisma.mapHierarchyMaster.findMany({
    include: {
      parentMap: true,
      childMaps: true,
    },
  });

  const session = await requireAuthorOrAdmin();

  return (
    <SessionProvider session={session}>
      <div className="w-full flex flex-col gap-4 mt-5">
        <div
          className="flex border-b p-2 border-b-slate-200  justify-between items-center"
          id="title-row"
        >
          <h1>Mastermaps</h1>
          <div id="actions">
            <Button asChild>
              <Link href={"/editor/mastermaps/create"}>Create</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-md sm:border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="font-medium">ID</TableHead>
                <TableHead className="font-medium">Title</TableHead>
                <TableHead className="font-medium">Parent</TableHead>
                <TableHead className="font-medium">Children</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {masterMaps.map((map) => (
                <TableRow key={map.id} data-href="/">
                  <TableCell>{map.id}</TableCell>
                  <TableCell>
                    <Link href={`/editor/mastermaps/${map.id}`}>
                      {map.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/editor/mastermaps/${map.parentMapId}`}>
                      {map.parentMap?.title || map.parentMapId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {/* 20250602 To do:  */}
                    {map.childMaps.length > 0
                      ? map.childMaps.map((child) => child.id).join(", ")
                      : "No children"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </SessionProvider>
  );
}
