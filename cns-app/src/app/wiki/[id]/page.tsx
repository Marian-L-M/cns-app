import prisma from "../../../../prisma/db";

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

  return (
    <div className="flex gap-10">
      <div className="content-col">
        <h1>{wiki.title}</h1>
        <p>{wiki.description}</p>
      </div>
      <div id="info-box">
        <h2>Info</h2>
        <p>Infobox contents here</p>
      </div>
    </div>
  );
};

export default WikiPage;

// Todo 240823 rework database schema to allow name as slug + add content section json fields -> Think about good breakdown
