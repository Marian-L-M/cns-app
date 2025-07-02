import { Edit, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WikiInfoboxItem } from "@prisma/client";
import InfoboxRow from "./parts/InfoboxRow";
import DeleteButton from "../buttons/DeleteButton";

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
            <InfoboxRow infoboxItem={infoboxItem} />
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
              <DeleteButton
                objectId={infoboxItem.id}
                type="Infobox row"
                path="infobox"
                redirect={`/editor/wikis/${wikiId}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
