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
import Image from "next/image";
import Link from "next/link";
import InfoboxDisplayModule from "../InfoboxDisplayModule";

interface Props {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  infoData: {
    title?: string;
    description?: string;
    bannerUrl?: string;
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
  console.log(infoData);
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent className="flex flex-col gap-8 overflow-y-scroll">
        {infoData?.bannerUrl && (
          <div className="w-full aspect-2/3 relative max-h-48">
            <Image
              src={infoData?.bannerUrl}
              alt={"bannerImg"}
              className="object-cover object-center"
              fill={true}
            />
          </div>
        )}
        <SheetHeader>
          <SheetTitle>{infoData?.title}</SheetTitle>
          <SheetDescription>{infoData?.description}</SheetDescription>
        </SheetHeader>
        {infoData.wiki?.infoboxItems && (
          <InfoboxDisplayModule infobox={infoData.wiki?.infoboxItems} />
        )}
        <SheetFooter>
          {infoData?.wikiId && (
            <Link href={`/wiki/${infoData?.wiki?.slug}`}>
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
