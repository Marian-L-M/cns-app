import AuthorFilter from "@/components/templates/searchbar/AuthorFilter";
import SearchInput from "@/components/templates/searchbar/SearchInput";
import StatusFilter from "./StatusFilter";

type AuthorWithProfile = {
  id: string;
  userProfile: {
    id: number;
    slug: string | null;
    createdAt: Date;
    updatedAt: Date;
    displayName: string;
    profileCatch: string | null;
    profileDescription: string | null;
    banner: string | null;
    thumbnail: string | null;
    socials: any[]; // JsonValue[]
    userId: string;
  } | null;
};

interface Props {
  authorList: AuthorWithProfile[];
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
