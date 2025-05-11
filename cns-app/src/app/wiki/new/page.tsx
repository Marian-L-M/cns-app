"use client";
import dynamic from "next/dynamic";

const WikiForm = dynamic(() => import("@/components/forms/WikiForm"), {
  ssr: false,
});

export default function NewWiki() {
  return <WikiForm />;
}
