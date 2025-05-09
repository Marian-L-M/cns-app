"use client";
import dynamic from "next/dynamic";

const MapForm = dynamic(() => import("@/components/forms/MapForm"), {
  ssr: false,
});

export default function NewMap() {
  return <MapForm />;
}
