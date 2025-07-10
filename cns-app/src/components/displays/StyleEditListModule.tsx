import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CanvasStyleItem } from "@prisma/client";
import DeleteButton from "../buttons/DeleteButton";

interface Props {
  canvasStyles?: CanvasStyleItem[];
  showStyleForm: (canvasStyles: CanvasStyleItem) => void;
  currentPage: string;
}

export default function StyleEditListModule({
  canvasStyles,
  showStyleForm,
  currentPage,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {canvasStyles?.map((style) => (
        <div
          key={`canvasStyleItem-${style.id}`}
          className="w-full flex justify-between gap-2"
        >
          <div className="w-3/4 flex gap-2 items-center">
            <h5 className="font-bold">{style.type}</h5>
            <span>{style.value}</span>
          </div>
          {/* action container */}
          <div className="w-1/4 flex items-start justify-end gap-2">
            <div className="flex items-center gap-2">
              <Button
                className="text-xs p-1"
                variant="outline"
                onClick={() => showStyleForm(style)}
              >
                <Edit className="text-xs" />
              </Button>
              <DeleteButton
                objectId={style.id}
                type="Canvas Style Item"
                path="styles"
                redirect={currentPage}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
