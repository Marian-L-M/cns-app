"use client";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return <DropdownMenu>Toggle</DropdownMenu>;
}

export default ModeToggle;
