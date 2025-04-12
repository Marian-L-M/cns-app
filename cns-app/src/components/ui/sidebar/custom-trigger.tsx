"use client";
import Image from "next/image";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SquareChevronRight, SquareChevronLeft } from "lucide-react";
import { Button } from "../button";

// import { useSidebar } from "@/components/ui/sidebar";

// export function AppSidebar() {
//   const {
//     state,
//     open,
//     setOpen,
//     openMobile,
//     setOpenMobile,
//     isMobile,
//     toggleSidebar,
//   } = useSidebar();
// }

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
