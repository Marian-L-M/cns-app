"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { User, UserCog } from "lucide-react";
import Link from "next/link";

function UserToggle() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={`ghost`}
          className="aspect-square p-2 rounded-full border border-slate-800 hover:opacity-75"
        >
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel asChild>
          <Link href={"/"} className="dropdown-label flex items-center gap-1">
            <User className="flex-1" />
            <div>
              <div className="text-sm font-bold">User name</div>
              <div className="text-xs">account id</div>
            </div>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel asChild>
          <div className="dropdown-label">Bookmarks</div>
        </DropdownMenuLabel>
        <DropdownMenuLabel asChild>
          <div className="dropdown-label">Favorites</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel asChild>
          <div className="dropdown-label">Profile</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel asChild>
          <div className="dropdown-label">Settings</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel asChild>
          <div className="dropdown-label">Support</div>
        </DropdownMenuLabel>
        <DropdownMenuLabel asChild>
          <div className="dropdown-label">FAQ</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel asChild>
          <div className="dropdown-label">Logout</div>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserToggle;
