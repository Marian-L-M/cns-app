"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

function SearchInput() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const encodedSearchQuery = encodeURI(searchQuery);
    router.push(`/search?q=${encodedSearchQuery}`);
  };

  return (
    <form className="flex justify-centerw-2/3" onSubmit={onSearch}>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        placeholder="Search wiki article..."
        className="px-5 py-1 w-2/3 sm:px-5 sm:py-3 flex-1 text-zinc-800 bg-slate-200 rounded-3xl"
      />
    </form>
  );
}

export default SearchInput;
