"use client";
import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar";
import { SquareChevronRight, SquareChevronLeft } from "lucide-react";
import { Button } from "../button";
import { APP_NAME } from "@/lib/constants";

export function CustomTrigger() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <div
      className={`flex gap-2 p-2 items-center ${
        open ? "flex-row justify-between" : "flex-col"
      }`}
    >
      <div className="flex gap-2 items-center" id="logo-wrapper">
        <Image
          id="logo"
          src="/ui/logo.png"
          alt={`${APP_NAME} logo`}
          height={32}
          width={32}
          priority
        />
        {open && <span className="text-sm/3">{APP_NAME}</span>}
      </div>
      <Button variant={"ghost"} onClick={toggleSidebar} className="p-0">
        {open ? <SquareChevronLeft /> : <SquareChevronRight />}
      </Button>
    </div>
  );
}
