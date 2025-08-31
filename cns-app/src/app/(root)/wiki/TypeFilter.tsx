"use client";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectLabel } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TypeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<string | undefined>();

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Reset the select value
    setValue(undefined);

    // Update URL by removing the type parameter
    const params = new URLSearchParams();

    // Preserve other search params except type
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
          {/* 250830 To do: make dynamic */}
          <SelectLabel>Types</SelectLabel>
          <SelectItem value={"GENERAL"}>General</SelectItem>
          <SelectItem value={"STORY"}>Story</SelectItem>
          <SelectItem value={"AREA"}>Area</SelectItem>
          <SelectItem value={"CHARACTER"}>Character</SelectItem>
          <SelectItem value={"OBJECT"}>Object</SelectItem>
          <SelectItem value={"HISTORY"}>History</SelectItem>
          <SelectItem value={"SCIENCE"}>Science</SelectItem>
          <SelectItem value={"EXPLANATION"}>Explanation</SelectItem>
          <SelectItem value={"OTHER"}>Other</SelectItem>
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
