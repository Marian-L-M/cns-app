"use client";
import SearchInput from "@/components/inputs/SearchInput";
import { Wiki } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import useSWR from "swr";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import { Button } from "../button";

interface WikiSearchDialogProps {
  setSelectedWikiId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

interface WikiDataProps {
  data:
    | {
        message: string;
        wikis: Wiki[];
      }
    | undefined;
  setSelectedWikiId: React.Dispatch<React.SetStateAction<number | undefined>>;
  onSelect: () => void;
}

const fetchPosts = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};

function WikiSearchDialog({ setSelectedWikiId }: WikiSearchDialogProps) {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <div className="flex-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary">Search Wikis...</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Search Wikis</DialogTitle>
            <DialogDescription>
              Search for wiki title or keywords
            </DialogDescription>
          </DialogHeader>
          <Suspense fallback={<div>Loading...</div>}>
            <SearchBlock
              setSelectedWikiId={setSelectedWikiId}
              onClose={closeDialog}
            />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WikiSearchDialog;

// Components
// 250226 To do type declaration is dirty
function SearchBlock({
  setSelectedWikiId,
  onClose,
}: WikiSearchDialogProps & { onClose: () => void }) {
  // const search = useSearchParams();
  // const searchQuery = search ? search?.get("q") : null;
  const [searchTerm, setSearchTerm] = useState("");
  const [encodedSearchQuery, setEncodedSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // const encodedSearchQuery = encodeURI(searchQuery || "");
  const { data, isLoading } = useSWR<{ message: string; wikis: Array<Wiki> }>(
    `/api/search/wiki?q=${encodedSearchQuery}`,
    fetchPosts
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // setEncodedSearchQuery(encodeURI(searchTerm));
    if (searchTerm.trim()) {
      setEncodedSearchQuery(encodeURI(searchTerm.trim()));
      setHasSearched(true);
    }
  };

  return (
    <div className="flex flex-col gap-10 items-center p-6">
      {/* <SearchInput /> */}
      <form
        onSubmit={handleSearch}
        className="w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search wikis..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (searchTerm.trim()) {
                setEncodedSearchQuery(encodeURI(searchTerm.trim()));
                setHasSearched(true);
              }
            }}
          >
            Search
          </Button>
        </div>
      </form>
      {hasSearched ? (
        <>
          <h3 className="text-2xl font-bold">Search Results</h3>
          <div className="grid gap-4 py-4 w-full">
            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <DataList
                data={data}
                setSelectedWikiId={setSelectedWikiId}
                onSelect={onClose}
              />
            )}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          Enter a search term
        </div>
      )}
    </div>
  );
}

function DataList({ data, setSelectedWikiId, onSelect }: WikiDataProps) {
  if (!data?.wikis) {
    return null;
  }
  return (
    <div className="flex flex-col items-center w-full gap-2">
      {data.wikis.map((wiki) => (
        <button
          className="py-1 px-2 flex flex-row w-full border border-slate-200 rounded-sm hover:bg-slate-100 hover:text-slate-500 cursor-pointer"
          key={wiki.id}
          onClick={() => {
            setSelectedWikiId(wiki.id);
            onSelect();
          }}
        >
          {wiki.title}
        </button>
      ))}
    </div>
  );
}

// 250225 TO DO
// 1. Wiki search trigger submits form and sends back to overview page
// 2. Limit initial search to ~10 most recent wikis
// 3. Make items clickable instead of a save button
