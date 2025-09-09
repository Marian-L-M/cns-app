import TypeFilter from "@/components/wiki/searchbar/TypeFilter";
import AuthorFilter from "@/components/wiki/searchbar/AuthorFilter";
import Link from "next/link";
import { Button } from "../../ui/button";
import { User } from "@prisma/client";
import SearchInput from "./SearchInput";

interface Props {
  authorList: User[];
}

export default function WikiSearchBar({ authorList }: Props) {
  return (
    <div className="w-full flex flex-col gap-4 border rounded-md p-4">
      <div className="flex gap-4 items-center">
        <AuthorFilter authors={authorList} />
        <TypeFilter />
        <SearchInput />
      </div>
      <Link href="/wiki/featured">
        <Button>Reset</Button>
      </Link>
    </div>
  );
}
