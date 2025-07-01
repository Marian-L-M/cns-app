import Image from "next/image";
import { Edit, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WikiInfoboxItem } from "@prisma/client";

interface Props {
  wikiId: number;
  infobox?: WikiInfoboxItem[];
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  showInfoboxForm: (infobox: WikiInfoboxItem) => void;
}

export default function InfoboxEditListModule({
  wikiId,
  infobox,
  dialogOpen,
  setDialogOpen,
  showInfoboxForm,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {infobox?.map((infoboxItem) => (
        <div
          key={`infoboxItem-${infoboxItem.id}`}
          className="w-full flex justify-between gap-2"
        >
          {/* Todo: Dialog Form should be split Buttons should just prefill it */}
          {/* <InfoboxItemForm infoboxItem={infoboxItem} wikiId={wikiId} /> */}
          {/* content-container */}
          <div className="w-4/5">
            {infoboxItem.type == "TITLE" && (
              // Type Title
              <div className="w-full">
                <h2 className="text-xl w-full bg-gray-100 text-center mb-2">
                  {infoboxItem.title}
                </h2>
              </div>
            )}
            {infoboxItem.type == "IMAGE" && (
              // Type image with optional caption
              <div className="w-full flex flex-col items-center">
                <Image
                  width={280}
                  height={280}
                  src={infoboxItem.imageUrl}
                  alt={infoboxItem.caption}
                  className="w-full"
                  layout="responsive"
                />
                {infoboxItem.caption && (
                  <h3 className="w-full text-md bg-gray-100 text-center mb-2">
                    {infoboxItem.caption}
                  </h3>
                )}
              </div>
            )}
            {infoboxItem.type == "TEXT" && (
              // Type Text with optional title
              <div className="w-full">
                {infoboxItem.title && (
                  <h3 className="text-md w-full bg-gray-100 text-center mb-2">
                    {infoboxItem.title}
                  </h3>
                )}
                <p>{infoboxItem.description}</p>
              </div>
            )}
            {infoboxItem.type == "COLLECTION" && (
              // Type collection
              <div className="w-full ">
                {infoboxItem.collections.map((collection) => (
                  <div key={`collection-${collection?.title}`}>
                    <h3 className="w-full text-xs  bg-gray-100 text-center mb-2">
                      {collection?.title}
                    </h3>
                    <div className=" text-xs flex flex-col gap-1">
                      {collection?.bars?.map((bar) => (
                        <div key={`bar-${bar?.value}`} className="flex gap-2">
                          <span className="font-bold w-1/4">{bar.key}</span>
                          <span className=" w-3/4">{bar.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* action container */}
          <div className="w-1/5 flex items-start justify-end gap-2">
            <div className="p-1 rounded-sm aspect-square border border-slate-200 flex items-center">
              {infoboxItem.order}
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button
                className="text-xs p-1"
                variant="outline"
                onClick={() => showInfoboxForm(infoboxItem)}
              >
                <Edit className="text-xs" />
              </Button>
              <Button className="text-xs p-1" variant="destructive">
                <Trash className="text-xs" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
