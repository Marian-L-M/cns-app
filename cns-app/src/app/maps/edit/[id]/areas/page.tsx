import MapEditor from "@/components/editors/MapEditor";
import React from "react";

interface Props {
  params: { id: string };
}

const MapAreaEditor = ({ params }: Props) => {
  return (
    <>
      <MapEditor mapId={params.id} />
    </>
  );
};

export default MapAreaEditor;
