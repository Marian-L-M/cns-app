import useSWR from "swr";
import React from "react";

import InfoBox from "@/components/wiki/InfoBox";

export default function InfoBoxContents({ wikiId }: { wikiId: number }) {
  const { data, error } = useSWR(`/api/wiki/${wikiId}`, (url) =>
    fetch(url).then((res) => res.json())
  );

  if (!data) {
    return <h1>No infobox</h1>;
  }
  const infoBox = data.infobox as InfoBoxItem[];

  return <div>{infoBox && <InfoBox infoBox={infoBox} />}</div>;
}
