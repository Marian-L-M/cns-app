"use client";
import SearchInput from "@/components/inputs/SearchInput";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import useSWR from "swr";

const fetchPosts = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};

function SearchBlock() {
  const search = useSearchParams();
  const searchQuery = search ? search?.get("q") : null;

  const encodedSearchQuery = encodeURI(searchQuery || "");
  const { data, isLoading } = useSWR(
    `/api/search?q=${encodedSearchQuery}`,
    fetchPosts
  );

  console.log("Data", data);
  return (
    <div className="flex flex-col gap-10 items-center p-6">
      <SearchInput />
      <h1 className="text-3xl font-bold">Search Results</h1>
      <div className="flex flex-col items-center w-full"></div>
    </div>
  );
}

function SearchPage() {
  return (
    <div className="flex flex-col gap-10 items-center p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchBlock />
      </Suspense>
    </div>
  );
}

export default SearchPage;
