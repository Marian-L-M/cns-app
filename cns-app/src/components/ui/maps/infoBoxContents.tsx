import InfoBox from "@/components/wiki/InfoBox";
import React, { useEffect } from "react";
import useSWR from "swr";

// Error: async/await is not yet supported in Client Components, only Server Components. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.

function InfoBoxContents({ wikiId }: { wikiId: number }) {
  const { data, error } = useSWR(`/api/wiki/${wikiId}`, (url) =>
    fetch(url).then((res) => res.json())
  );

  if (!data) {
    return <h1>No infobox</h1>;
  }
  const infoBox = data.infobox as InfoBoxItem[];

  return <div>{infoBox && <InfoBox infoBox={infoBox} />}</div>;
}

export default InfoBoxContents;
