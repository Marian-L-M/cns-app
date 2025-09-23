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
import { UserProfile } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  userProfile: UserProfile | null;
}

export default function AuthorFilter({ authors }: { authors: Props[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<string>("");

  // Sync internal state with URL params
  useEffect(() => {
    const authorParam = searchParams.get("author");
    setValue(authorParam || "");
  }, [searchParams]);

  // Clear dropdown
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Set search params while preseving existent
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== "author") {
        params.append(key, value);
      }
    });

    const query = params.size ? `?${params.toString()}` : "";
    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <Select
      value={value}
      onValueChange={(author) => {
        const params = new URLSearchParams();

        if (author && author !== "all") {
          params.append("author", author);
        }

        // Preserve other search params
        searchParams.forEach((value, key) => {
          if (key !== "author") {
            params.append(key, value);
          }
        });

        const query = params.size ? `?${params.toString()}` : "";
        router.push(`${window.location.pathname}${query}`);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by Author..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {authors
            .filter((author) => author.userProfile) // Only show authors with profile
            .map((author) => (
              <SelectItem
                key={`author-${author.id}`}
                value={author.userProfile!.displayName}
              >
                {author.userProfile!.displayName}
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
