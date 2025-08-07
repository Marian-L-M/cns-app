import Link from "next/link";
import React from "react";

import { User } from "@prisma/client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  users: User[];
}

export default function DataTableSimple({ users }: Props) {
  return (
    <div className="w-full mt-5">
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">email</TableHead>
              <TableHead className="font-medium">image</TableHead>
              <TableHead className="font-medium">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              ? users.map((user) => (
                  <TableRow key={user.id} data-href="/">
                    <TableCell>
                      <Link href={`/users/${user.id}`}>{user.name}</Link>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.image}</TableCell>
                    <TableCell>{user.role}</TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
