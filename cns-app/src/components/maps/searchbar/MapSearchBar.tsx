import AuthorFilter from "@/components/templates/searchbar/AuthorFilter";
import SearchInput from "@/components/templates/searchbar/SearchInput";
import { User } from "@prisma/client";

interface Props {
  authorList: User[];
}

export default function MapSearchBar({ authorList }: Props) {
  return (
    <div className="flex gap-4 items-center">
      <AuthorFilter authors={authorList} />
      <SearchInput />
    </div>
  );
}
