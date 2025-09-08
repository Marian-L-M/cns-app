"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchInput() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams);

    if (searchQuery.trim()) {
      params.set("title", searchQuery.trim());
    } else {
      params.delete("title");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <form className="flex justify-center w-[200px]" onSubmit={onSearch}>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        placeholder="Search by wiki title"
        className="px-5 py-1  sm:px-5 sm:py-3 flex-1 text-zinc-800 bg-slate-200 rounded-3xl"
      />
    </form>
  );
}
