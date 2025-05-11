"use client";
import { SquareChevronRight, SquareChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function CustomTrigger() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <span className={`flex px-0 ${open ? "justify-end" : "justify-start"}  `}>
      <Button
        variant={"ghost"}
        onClick={toggleSidebar}
        className="p-0 h-9 w-9 bg-transparent hover:bg-transparent "
      >
        {open ? <SquareChevronLeft /> : <SquareChevronRight />}
      </Button>
    </span>
  );
}
