import prisma from "../../../../prisma/db";
import ReactMarkDown from "react-markdown";
import InfoBox from "@/components/wiki/InfoBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="flex flex-col gap-20 w-full mt-10 px-8">
      <Tabs defaultValue="article" className="w-full">
        <TabsList>
          <TabsTrigger value="article">Article</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="revisions">Revisions</TabsTrigger>
        </TabsList>
        <TabsContent value="article">
          <div className="grid gap-4 grid-cols-8" id="intro-content">
            <div className="content-col col-span-6">
              <h1>{wiki.title}</h1>
              <p>{wiki.description}</p>
            </div>
            {infoBox && <InfoBox infoBox={infoBox} />}
          </div>
          <div className="flex flex-col gap-10 " id="main-content">
            <ReactMarkDown>{wiki.wikiText}</ReactMarkDown>
          </div>
        </TabsContent>
        <TabsContent value="discussion">Discuss contents</TabsContent>
        <TabsContent value="revisions">Revisions</TabsContent>
      </Tabs>
    </div>
  );
};

export default WikiPage;

// Todo 240823 rework database schema to allow name as slug + add content section json fields -> Think about good breakdown
// Todo 240827 add edit button to wiki page

// Layout inspiration
// https://dribbble.com/shots/6468579/attachments/6468579-Wikipedia-Redesign?mode=media
// https://dribbble.com/shots/6482210-Wikipedia-redesign/attachments/6482210-Wikipedia-redesign?mode=media
// https://dribbble.com/shots/21516412-Wikipedia-Redesign
