// changed filename to small letters for mac compatibility issues
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import InfoboxDisplayModule from "../InfoboxDisplayModule";

interface Props {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  infoData: {
    title?: string;
    description?: string;
    wikiId?: number;
    wiki?: {
      infoboxItems?: any;
      slug?: string;
    };
  };
}

export default function InfoboxSheet({
  sheetOpen,
  setSheetOpen,
  infoData,
}: Props) {
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent className="flex flex-col gap-8">
        <SheetHeader>
          <SheetTitle>{infoData?.title}</SheetTitle>
          <SheetDescription>{infoData?.description}</SheetDescription>
        </SheetHeader>
        {infoData.wiki?.infoboxItems && (
          <InfoboxDisplayModule infobox={infoData.wiki?.infoboxItems} />
        )}
        <SheetFooter>
          {infoData?.wikiId && (
            <Link href={`/wiki/${infoData?.wikiId}`}>
              <Button>Read the full wiki</Button>
            </Link>
          )}
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
