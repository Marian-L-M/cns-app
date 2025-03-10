"use client";
import dynamic from "next/dynamic";
import { Wiki } from "@prisma/client";

interface Props {
  wiki: Wiki;
}

const WikiForm = dynamic(() => import("@/components/forms/WikiForm"), {
  ssr: false,
});

const EditWikiClient = ({ wiki }: Props) => {
  return <WikiForm wiki={wiki} />;
};

export default EditWikiClient;
