import { useContext } from "react";
import { StatusContext } from "@/store/statusContext";
import Link from "next/link";
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

function InfoBox(props: StatusProps) {
  const statusCtx = useContext(StatusContext);
  const { title, id, type, infoData } = props;
  const activeInfoData = infoData.find((active) => active.id === id);

  return (
    <div className="w-full">
      {activeInfoData?.wikiId ? (
        <div className="flex-col gap-2">
          <InfoBoxContents wikiId={activeInfoData.wikiId} />
          <Link href={`/wiki/${activeInfoData.wikiId}`}>Wikiへ</Link>
        </div>
      ) : (
        <p>No matching data found.</p>
      )}
      <button onClick={statusCtx.hideInfoBox}>Close Infobox</button>
    </div>
  );
}

export default InfoBox;
