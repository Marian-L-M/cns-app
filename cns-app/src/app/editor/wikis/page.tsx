import Link from "next/link";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
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

export default async function MasterMapPage() {
  const wikis = await prisma.wiki.findMany({
    include: {
      authors: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="w-full flex flex-col gap-4 mt-5">
        <div
          className="flex border-b p-2 border-b-slate-200  justify-between items-center"
          id="title-row"
        >
          <h1>Wikis</h1>
          <div id="actions">
            <Button asChild>
              <Link href={"/editor/wikis/create"}>Create</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-md sm:border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="font-medium">ID</TableHead>
                <TableHead className="font-medium">Title</TableHead>
                <TableHead className="font-medium">Type</TableHead>
                <TableHead className="font-medium">Tags</TableHead>
                <TableHead className="font-medium">Authors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wikis.map((wiki) => (
                <TableRow key={wiki.id} data-href="/">
                  <TableCell>{wiki.id}</TableCell>
                  <TableCell>
                    <Link href={`/editor/wikis/${wiki.id}`}>{wiki.title}</Link>
                  </TableCell>
                  <TableCell>{wiki.type}</TableCell>
                  <TableCell>
                    {" "}
                    {wiki.tags.length > 0
                      ? wiki.tags.map((tag) => tag).join(", ")
                      : "No tags"}
                  </TableCell>
                  <TableCell>
                    {wiki.authors?.length > 0
                      ? wiki.authors.map((author) => author.name).join(", ")
                      : "No Authors"}
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
