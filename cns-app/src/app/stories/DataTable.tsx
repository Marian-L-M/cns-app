import EntryRating from "@/components/EntryRating";
import EntryStatusBadge from "@/components/EntryStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Entry } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { ArrowDown } from "lucide-react";
import { SearchParams } from "./page";
import { buttonVariants } from "@/components/ui/button";

interface Props {
  entries: Entry[];
  searchParams: SearchParams;
}

const DataTable = ({ entries, searchParams }: Props) => {
  // Create simple query objects to avoid serialization errors
  const createQueryObject = (orderBy: string) => ({
    orderBy,
    ...(searchParams.status && { status: searchParams.status }),
    ...(searchParams.page && { page: searchParams.page }),
  });

  return (
    <div className="w-full mt-5">
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Link href={{ query: createQueryObject("title") }}>Title</Link>
                {"title" === searchParams.orderBy && (
                  <ArrowDown className="inline p-1" />
                )}
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <div className="flex justify-center">
                  <Link href={{ query: createQueryObject("status") }}>
                    Status
                  </Link>
                  {"status" === searchParams.orderBy && (
                    <ArrowDown className="inline p-1" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex justify-center">
                  <Link href={{ query: createQueryObject("rating") }}>
                    Rating
                  </Link>
                  {"rating" === searchParams.orderBy && (
                    <ArrowDown className="inline p-1" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <Link href={{ query: createQueryObject("createdAt") }}>
                  Created At
                </Link>
                {"createdAt" === searchParams.orderBy && (
                  <ArrowDown className="inline p-1" />
                )}
              </TableHead>
              <TableHead>
                {" "}
                <Link href={{ query: createQueryObject("updatedAt") }}>
                  Updated At
                </Link>
                {"updatedAt" === searchParams.orderBy && (
                  <ArrowDown className="inline p-1" />
                )}
              </TableHead>
              <TableHead>...</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries
              ? entries.map((entry) => (
                  <TableRow key={entry.id} data-href="/">
                    <TableCell>
                      <Link href={`/stories/${entry.id}`}>{entry.title}</Link>
                    </TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <EntryStatusBadge status={entry.status} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <EntryRating rating={entry.rating} />
                      </div>
                    </TableCell>
                    <TableCell>
                      {entry.createdAt.toLocaleDateString("ja-JP", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      {entry.updatedAt.toLocaleDateString("ja-JP", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/stories/${entry.id}/edit`}
                        className={buttonVariants({ variant: "outline" })}
                      >
                        Edit
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
