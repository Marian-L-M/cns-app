import MapEditor from "@/components/editors/MapEditor";
import React from "react";

interface Props {
  params: { id: string };
}

const MapAreaEditor = ({ params }: Props) => {
  return (
    <div>
      <MapEditor mapId={params.areaId} />
    </div>
  );
};

export default MapAreaEditor;
