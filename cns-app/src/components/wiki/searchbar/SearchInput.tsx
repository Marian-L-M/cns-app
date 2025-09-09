"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchInput() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync internal state with URL params
  useEffect(() => {
    const titleParam = searchParams.get("title");
    setSearchQuery(titleParam || "");
  }, [searchParams]);

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    // Set search params while preseving existent
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.append("title", searchQuery.trim());
    }

    searchParams.forEach((value, key) => {
      if (key !== "title") {
        params.append(key, value);
      }
    });

    const query = params.size ? `?${params.toString()}` : "";
    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <form
      className="flex items-center gap-2 justify-center w-fit"
      onSubmit={onSearch}
    >
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        placeholder="Search by wiki title"
        className="px-2 py-2 text-zinc-800 bg-slate-50 rounded-md  w-[200px] border border-slate-100"
      />
      {/* <Button variant={"secondary"}>Search</Button> */}
    </form>
  );
}
