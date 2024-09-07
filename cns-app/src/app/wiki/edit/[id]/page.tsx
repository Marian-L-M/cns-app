import dynamic from "next/dynamic";
import prisma from "../../../../../prisma/db";

interface Props {
  params: { id: string };
}

const WikiForm = dynamic(() => import("@/components/forms/WikiForm"), {
  ssr: false,
});

const EditWikiPage = async ({ params }: Props) => {
  const wiki = await prisma.wiki.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!wiki) {
    return <p className="text-destructive">Wiki not found</p>;
  }

  return <WikiForm wiki={wiki} />;
};

export default EditWikiPage;

// 2240907 Next action: Change description to a text field
// 2240907 Next action: Make Wiki body text fields generative
