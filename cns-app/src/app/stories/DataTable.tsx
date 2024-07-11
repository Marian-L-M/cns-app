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
import React from "react";

interface Props {
  entries: Entry[];
}

const DataTable = ({ entries }: Props) => {
  return (
    <div className="w-full mt-5">
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <div className="flex justify-center">Status</div>
              </TableHead>
              <TableHead>
                <div className="flex justify-center">Rating</div>
              </TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries
              ? entries.map((entry) => (
                  <TableRow key={entry.id} data-href="/">
                    <TableCell>{entry.title}</TableCell>
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
