import Link from "next/link";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../../ui/button";
import { Search } from "lucide-react";
import ModeToggle from "./ModeToggle";

let login: boolean = true;

const TopNav = () => {
  return (
    <div className="w-full flex justify-end items-center gap-4 p-4 pr-8 ">
      <ModeToggle />
      <div className="meta-container flex flex-col gap-2">
        <div className="meta-links flex text-xs gap-24" id="meta-container">
          <div className="link-container flex gap-2 text-gray-500">
            <Link href="/discussions">Discussions</Link>
            <Link href="/contribute">Contributions</Link>
          </div>
          {login ? (
            <div
              className="login-state flex flex-row gap-2 font-semibold"
              id="login-state"
            >
              <Link className="hover:opacity-75" href="/sign-in">
                Sign In
              </Link>
            </div>
          ) : (
            <div
              className="login-state flex flex-row font-semibold"
              id="login-state"
            >
              <Link href="/logout">Logout</Link>
            </div>
          )}
        </div>
        <div className="search-container">
          <div className="flex  max-w-sm items-center ">
            <Input
              type="search"
              placeholder="Search"
              className="text-xs m-0 p-2 h-8 rounded-none"
            />
            <Button
              variant={"outline"}
              type="submit"
              className="text-xs m-0 p-2 h-8 rounded-none"
              aria-label="search articles"
            >
              <Search className="w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
