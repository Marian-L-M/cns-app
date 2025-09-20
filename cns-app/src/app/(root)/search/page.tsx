"use client";
import SearchInput from "@/components/inputs/SearchInput";
import { Wiki } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import useSWR from "swr";

interface WikiDataProps {
  data:
    | {
        message: string;
        wikis: Wiki[];
      }
    | undefined;
}

// To do: Check, does this fetch actually do something?
async function fetchPosts(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

function SearchBlock() {
  const search = useSearchParams();
  const searchQuery = search ? search?.get("q") : null;

  const encodedSearchQuery = encodeURI(searchQuery || "");
  const { data, isLoading } = useSWR<{ message: string; wikis: Array<Wiki> }>(
    `/api/search?q=${encodedSearchQuery}`,
    fetchPosts
  );

  return (
    <div className="flex flex-col gap-10 items-center p-6">
      <SearchInput />
      <h1 className="text-3xl font-bold">Search Results</h1>
      <DataList data={data} />
    </div>
  );
}

function DataList({ data }: WikiDataProps) {
  if (!data?.wikis) {
    return null;
  }
  return (
    <div className="flex flex-col items-center w-full">
      {data.wikis.map((wiki) => (
        <div className="flex flex-row" key={wiki.id}>
          {wiki.title}
        </div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="flex flex-col gap-10 items-center p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchBlock />
      </Suspense>
    </div>
  );
}
