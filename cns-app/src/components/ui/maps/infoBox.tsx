import { useContext } from "react";
import { StatusContext } from "@/store/statusContext";
import Link from "next/link";

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
    <div className="placeholder-classname">
      <h2>{title}</h2>
      <h3>{type}</h3>
      <p>ID: {id}</p>
      {activeInfoData ? (
        <div>
          <h4>{activeInfoData.title}</h4>
          <p>{activeInfoData.description}</p>
          {activeInfoData.wikiId ? (
            <Link href={`/wiki/${activeInfoData.wikiId}`}>Wikiへ</Link>
          ) : null}
        </div>
      ) : (
        <p>No matching data found.</p>
      )}
      <button onClick={statusCtx.hideInfoBox}>Close Infobox</button>
    </div>
  );
}

export default InfoBox;
