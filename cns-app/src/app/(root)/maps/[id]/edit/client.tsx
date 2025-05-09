"use client";
import dynamic from "next/dynamic";
import { Map } from "@prisma/client";

interface Props {
  map: Map;
}

const MapForm = dynamic(() => import("@/components/forms/MapForm"), {
  ssr: false,
});

export default function EditMapClient({ map }: Props) {
  return (
    <>
      <MapForm map={map} />
    </>
  );
}
