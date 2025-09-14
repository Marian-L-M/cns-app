"use client";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Status } from "@prisma/client";

export default function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<string>("");

  // Sync internal state with URL params
  useEffect(() => {
    const statusParam = searchParams.get("status");
    setValue(statusParam || "");
  }, [searchParams]);

  // Clear dropdown
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Set search params while preseving existent
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== "status") {
        params.append(key, value);
      }
    });

    const query = params.size ? `?${params.toString()}` : "";
    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <Select
      value={value}
      defaultValue={searchParams.get("status") || ""}
      onValueChange={(status) => {
        const params = new URLSearchParams();

        if (status && status !== "all") {
          params.append("status", status);
        }

        // Preserve other search params
        searchParams.forEach((value, key) => {
          if (key !== "status") {
            params.append(key, value);
          }
        });

        const query = params.size ? `?${params.toString()}` : "";
        router.push(`${window.location.pathname}${query}`);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by status..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          {Object.values(Status).map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </SelectItem>
          ))}
          <SelectSeparator />
          <Button
            className="w-full px-2"
            variant={"secondary"}
            size={"sm"}
            onClick={handleClear}
          >
            Clear
          </Button>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
