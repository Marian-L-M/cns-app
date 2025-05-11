import { SquareX } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { StatusContext } from "@/store/statusContext";

import InfoBoxContents from "./infoBoxContents";

interface StatusProps {
  title: string;
  id: number;
  type: string;
  infoData: Array<{
    id: number;
    title: string;
    description: string;
    wikiId: number;
  }>;
}

export default function InfoBox(props: StatusProps) {
  const statusCtx = useContext(StatusContext);
  const { title, id, type, infoData } = props;
  const activeInfoData = infoData.find((active) => active.id === id);

  return (
    <div className="w-full relative">
      <button
        className="absolute z-10 -right-3 -top-3 text-gray-100 bg-slate-900/80 rounded-sm hover:opacity-80"
        onClick={statusCtx.hideInfoBox}
      >
        <SquareX size={32} />
      </button>
      {activeInfoData?.wikiId ? (
        <div className="flex flex-col gap-8">
          <InfoBoxContents wikiId={activeInfoData.wikiId} />
          <Button className="w-fit self-center" variant={"outline"}>
            <Link href={`/wiki/${activeInfoData.wikiId}`}>Read more</Link>
          </Button>
        </div>
      ) : (
        <p>No matching data found.</p>
      )}
    </div>
  );
}
