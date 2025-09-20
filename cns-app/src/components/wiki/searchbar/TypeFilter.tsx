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
import { WikiType } from "@prisma/client";

export default function TypeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<string>("");

  // Sync internal state with URL params
  useEffect(() => {
    const typeParam = searchParams.get("type");
    setValue(typeParam || "");
  }, [searchParams]);

  // Clear dropdown
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Set search params while preseving existent
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== "type") {
        params.append(key, value);
      }
    });

    const query = params.size ? `?${params.toString()}` : "";
    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <Select
      value={value}
      defaultValue={searchParams.get("type") || ""}
      onValueChange={(type) => {
        const params = new URLSearchParams();

        if (type && type !== "all") {
          params.append("type", type);
        }

        // Preserve other search params
        searchParams.forEach((value, key) => {
          if (key !== "type") {
            params.append(key, value);
          }
        });

        const query = params.size ? `?${params.toString()}` : "";
        router.push(`${window.location.pathname}${query}`);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by type..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Types</SelectLabel>
          {Object.values(WikiType).map((type) => (
            <SelectItem key={type} value={type}>
              {type.charAt(0) + type.slice(1).toLowerCase()}
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
