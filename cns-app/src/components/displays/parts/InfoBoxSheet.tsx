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
import InfoBox from "@/components/wiki/InfoBox";
import Link from "next/link";

interface Props {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  infoData: {
    title?: string;
    description?: string;
    wikiId?: number;
    wiki?: {
      infobox?: any;
      slug?: string;
    };
  };
}

export default function InfoBoxSheet({
  sheetOpen,
  setSheetOpen,
  infoData,
}: Props) {
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{infoData?.title}</SheetTitle>
          <SheetDescription>{infoData?.description}</SheetDescription>
        </SheetHeader>
        {infoData?.wiki?.infobox && (
          <InfoBox infoBox={infoData?.wiki?.infobox} />
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
