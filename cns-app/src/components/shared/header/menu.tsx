import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

function Menu() {
  return (
    <div className="flex justify-end gap-3 w-full">
      <nav className="hidden md:flex py-4 px-8 w-full max-w-xs gap-1 items-center justify-end">
        <Button asChild variant={`ghost`}>
          <Link href={`/support`}>Support</Link>
        </Button>
        <Button asChild variant={`ghost`}>
          <Link href={`/discussions`}>Discuss</Link>
        </Button>
        <Button asChild>
          <Link href={`/sign-in`}>Sign In</Link>
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <Button asChild>
              <Link href={`/sign-in`}>Sign In</Link>
            </Button>
            <Button asChild variant={`ghost`}>
              <Link href={`/discussions`}>Discuss</Link>
            </Button>
            <Button asChild variant={`ghost`}>
              <Link href={`/support`}>Support</Link>
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}

export default Menu;
