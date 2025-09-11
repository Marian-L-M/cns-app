"use client";
import { Story } from "@prisma/client";
import { Suspense, useState } from "react";
import useSWR from "swr";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { Button } from "../button";

interface StorySearchDialogProps {
  setSelectedId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

interface StoryDataProps {
  data:
    | {
        message: string;
        stories: Story[];
      }
    | undefined;
  setSelectedId: React.Dispatch<React.SetStateAction<number | undefined>>;
  onSelect: () => void;
}

const fetchPosts = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};

function StorySearchDialog({ setSelectedId }: StorySearchDialogProps) {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <div className="flex-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary">Search Stories...</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Search Stories</DialogTitle>
            <DialogDescription>
              Search for Story title or keywords
            </DialogDescription>
          </DialogHeader>
          <Suspense fallback={<div>Loading...</div>}>
            <SearchBlock setSelectedId={setSelectedId} onClose={closeDialog} />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StorySearchDialog;

// Components
// 250226 To do type declaration is dirty
function SearchBlock({
  setSelectedId,
  onClose,
}: StorySearchDialogProps & { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [encodedSearchQuery, setEncodedSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { data, isLoading } = useSWR<{
    message: string;
    stories: Array<Story>;
  }>(`/api/search/stories?q=${encodedSearchQuery}`, fetchPosts);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchTerm.trim()) {
      setEncodedSearchQuery(encodeURI(searchTerm.trim()));
      setHasSearched(true);
    }
  };

  return (
    <div className="flex flex-col gap-10 items-center p-6">
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
            placeholder="Search stories..."
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
                setSelectedId={setSelectedId}
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

function DataList({ data, setSelectedId, onSelect }: StoryDataProps) {
  if (!data?.stories) {
    return null;
  }
  return (
    <div className="flex flex-col items-center w-full gap-2">
      {data.stories.map((story) => (
        <button
          className="py-1 px-2 flex flex-row w-full border border-slate-200 rounded-sm hover:bg-slate-100 hover:text-slate-500 cursor-pointer"
          key={story.id}
          onClick={() => {
            setSelectedId(story.id);
            onSelect();
          }}
        >
          {story.title}
        </button>
      ))}
    </div>
  );
}
