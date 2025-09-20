import AuthorFilter from "@/components/templates/searchbar/AuthorFilter";
import SearchInput from "@/components/templates/searchbar/SearchInput";
import { User } from "@prisma/client";
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
