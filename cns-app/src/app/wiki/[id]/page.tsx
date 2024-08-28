import prisma from "../../../../prisma/db";
import ReactMarkDown from "react-markdown";
import InfoBox from "@/components/wiki/InfoBox";

interface WikiPageProps {
  params: { id: string };
}

const WikiPage = async ({ params }: WikiPageProps) => {
  const wiki = await prisma?.wiki.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!wiki) {
    return <p className="text-destructive">Wiki Not Found</p>;
  }

  const infoBox = wiki.infobox as InfoBoxItem[];

  return (
    <div className="flex flex-col gap-20 w-5/6 max-w-screen-xl mt-10">
      <div className="grid gap-4 grid-cols-4" id="intro-content">
        <div className="content-col col-span-3">
          <h1>{wiki.title}</h1>
          <p>{wiki.description}</p>
        </div>
        <InfoBox infoBox={infoBox} />
      </div>
      <div className="flex flex-col gap-10 " id="main-content">
        <ReactMarkDown>{wiki.wikiText}</ReactMarkDown>
      </div>
    </div>
  );
};

export default WikiPage;

// Todo 240823 rework database schema to allow name as slug + add content section json fields -> Think about good breakdown
// Todo 240827 add edit button to wiki page
