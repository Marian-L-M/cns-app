import AuthorFilter from "@/components/story/searchbar/AuthorFilter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import SearchInput from "./SearchInput";
import StatusFilter from "./StatusFilter";

interface Props {
  authorList: User[];
}

export default function StorySearchBar({ authorList }: Props) {
  return (
    <div className="flex gap-4 items-center">
      <AuthorFilter authors={authorList} />
      <StatusFilter />
      <SearchInput />
    </div>
  );
}
