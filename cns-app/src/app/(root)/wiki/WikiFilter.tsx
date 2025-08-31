"use client";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserProfile } from "@prisma/client";

interface Props {
  id: string;
  RelatedUser: UserProfile;
}

export default function WikiFilter({ authors }: { authors: Props[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      defaultValue={searchParams.get("author") || ""}
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
          {authors.map((author) => (
            <SelectItem
              key={`author-${author.id}`}
              value={author.RelatedUser.displayName}
            >
              {author.RelatedUser.displayName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
